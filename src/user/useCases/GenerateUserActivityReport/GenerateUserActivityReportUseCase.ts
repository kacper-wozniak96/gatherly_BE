import { Inject, Injectable } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { REQUEST } from '@nestjs/core';
import { Queue } from 'bullmq';
import { IFailedField } from 'gatherly-types';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { ICommentRepo } from 'src/forum/repos/commentRepo';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { IPostVoteRepo } from 'src/forum/repos/postVoteRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from 'src/forum/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { EJobs } from 'src/shared/enums/Jobs';
import { EQueues } from 'src/shared/enums/Queues';
import { IGenerateUserActivityReportJob } from 'src/shared/interfaces/Jobs/sendReport';
import { ReportId } from '../../domain/ReportId';
import { UserEmail } from '../../domain/UserEmail';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class GenerateUserActivityReportUseCaseProvider implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
    @Inject(PostVoteRepoSymbol) private readonly postVoteRepo: IPostVoteRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    @InjectQueue(EQueues.reports) private reportsQueue: Queue,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const userEmailOrError = UserEmail.create({ value: requestData.dto.email });
    const reportIdOrError = ReportId.create({ value: requestData.dto.reportId });

    const dtoResult: Result<IFailedField[]> = Result.combine([userEmailOrError, reportIdOrError]);
    const failedFields = dtoResult.getErrorValue();

    if (dtoResult.isFailure) return left(new GenerateUserActivityReportErrors.InvalidDataError(failedFields));

    const userEmail = userEmailOrError.getValue() as UserEmail;
    const reportId = reportIdOrError.getValue() as ReportId;

    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new GenerateUserActivityReportErrors.UserDoesntExistError());

    const [postsCreatedCountByUser, downvotesCountByUser, upvotesCountByUser, commentsCountByUser] = await Promise.all([
      this.postRepo.getPostsCountCreatedByUser(user.userId),
      this.postVoteRepo.getDownvotesCountByUser(user.userId),
      this.postVoteRepo.getUpvotesCountByUser(user.userId),
      this.commentRepo.getCommentsCountByUser(user.userId),
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
