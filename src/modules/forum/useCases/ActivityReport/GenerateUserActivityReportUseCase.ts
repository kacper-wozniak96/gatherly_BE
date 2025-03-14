import { Inject, Injectable } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';
import { REQUEST } from '@nestjs/core';
import { Queue } from 'bullmq';
import { IFailedField } from 'gatherly-types';
import { ICommentRepo } from 'src/modules/forum/repos/commentRepo';
import { IPostRepo } from 'src/modules/forum/repos/postRepo';
import { IPostVoteRepo } from 'src/modules/forum/repos/postVoteRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { CustomRequest } from 'src/modules/Auth/strategies/jwt.strategy';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { EJobs } from 'src/shared/enums/Jobs';
import { EQueues } from 'src/shared/enums/Queues';
import { IGenerateUserActivityReportJob } from 'src/shared/interfaces/Jobs/sendReport';
import { ReportId } from '../../../user/domain/ReportId';
import { UserEmail } from '../../../user/domain/UserEmail';
import { IUserRepo } from '../../../user/repos/userRepo';
import { UserRepoSymbol } from '../../../user/repos/utils/symbols';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';
import { IGenerateUserActivityReportUseCase, RequestData, ResponseData } from './types';

@Injectable()
export class GenerateUserActivityReportUseCase implements IGenerateUserActivityReportUseCase {
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
