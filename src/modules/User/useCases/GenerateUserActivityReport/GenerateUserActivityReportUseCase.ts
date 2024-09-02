import { Inject, Injectable } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { REQUEST } from '@nestjs/core';
import { Queue } from 'bullmq';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { ICommentRepo } from 'src/modules/Forum/repos/commentRepo';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { IPostVoteRepo } from 'src/modules/Forum/repos/postVoteRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { EJobs } from 'src/shared/enums/Jobs';
import { EQueues } from 'src/shared/enums/Queues';
import { IGenerateUserActivityReportJob } from 'src/shared/interfaces/Jobs/sendReport';
import { ReportId } from '../../domain/ReportId';
import { UserEmail } from '../../domain/UserEmail';
import { UserId } from '../../domain/UserId';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { GenerateUserActivityReportRequestDTO } from './GenerateUserActivityReportDTO';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';

type Response = Either<GenerateUserActivityReportErrors.UserDoesntExistError | AppError.UnexpectedError, Result<void>>;

@Injectable()
export class GenerateUserActivityReportUseCaseProvider implements UseCase<GenerateUserActivityReportRequestDTO, Promise<Response>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
    @Inject(PostVoteRepoSymbol) private readonly postVoteRepo: IPostVoteRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    @InjectQueue(EQueues.reports) private reportsQueue: Queue,
  ) {}

  async execute(dto: GenerateUserActivityReportRequestDTO): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const userEmailOrError = UserEmail.create({ value: dto.email });
    const reportIdOrError = ReportId.create({ value: dto.reportId });

    const dtoResult = Result.combine([userIdOrError, userEmailOrError, reportIdOrError]);

    if (dtoResult.isFailure) return left(new AppError.UnexpectedError());

    const userId = userIdOrError.getValue();
    const userEmail = userEmailOrError.getValue() as UserEmail;
    const reportId = reportIdOrError.getValue() as ReportId;

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new GenerateUserActivityReportErrors.UserDoesntExistError());

    const [postsCreatedCountByUser, downvotesCountByUser, upvotesCountByUser, commentsCountByUser] = await Promise.all([
      this.postRepo.getPostsCountCreatedByUser(userId),
      this.postVoteRepo.getDownvotesCountByUser(userId),
      this.postVoteRepo.getUpvotesCountByUser(userId),
      this.commentRepo.getCommentsCountByUser(userId),
    ]);

    const jobData: IGenerateUserActivityReportJob = {
      reportId: reportId.value,
      userId: user.userId.getValue().toValue() as number,
      email: userEmail.value,
      username: user.username.value,
      postsCreatedCount: postsCreatedCountByUser,
      downvotesCount: downvotesCountByUser,
      upvotesCount: upvotesCountByUser,
      commentsCount: commentsCountByUser,
    };

    await this.reportsQueue.add(EJobs.sendReport, jobData);

    return right(Result.ok<void>());
  }
}
