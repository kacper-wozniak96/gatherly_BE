import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
// import * as fs from 'fs';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { ICommentRepo } from 'src/modules/Forum/repos/commentRepo';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { IPostVoteRepo } from 'src/modules/Forum/repos/postVoteRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { PDFService } from 'src/shared/infra/FileGenerator/pdfService';
import { FileService } from 'src/shared/infra/FileService/fileService';
import { MailService, MailServiceSymbol } from 'src/shared/infra/MailService/mailService';
import { ReportId } from '../../domain/ReportId';
import { UserEmail } from '../../domain/UserEmail';
import { UserId } from '../../domain/UserId';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { GenerateUserActivityReportRequestDTO } from './GenerateUserActivityReportDTO';
import { GenerateUserActivityReportErrors } from './GenerateUserActivityReportErrors';

type Response = Either<GenerateUserActivityReportErrors.UserDoesntExistError | AppError.UnexpectedError, Result<void>>;

export interface UserActivityReportData {
  reportId: string;
  username: string;
  userId: number;
  email: string;
  postsCreatedCount: number;
  downvotesCount: number;
  upvotesCount: number;
  commentsCount: number;
}

@Injectable()
export class GenerateUserActivityReportUseCase implements UseCase<GenerateUserActivityReportRequestDTO, Promise<Response>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
    @Inject(PostVoteRepoSymbol) private readonly postVoteRepo: IPostVoteRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
    private readonly pdfService: PDFService,
    private readonly fileService: FileService,
    @Inject(MailServiceSymbol) private readonly mailService: MailService,
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

    const abosoluteFilePath = this.fileService.createPathToUploadsFolder(`${reportId.value}.pdf`);

    const [postsCreatedCountByUser, downvotesCountByUser, upvotesCountByUser, commentsCountByUser] = await Promise.all([
      this.postRepo.getPostsCountCreatedByUser(userId),
      this.postVoteRepo.getDownvotesCountByUser(userId),
      this.postVoteRepo.getUpvotesCountByUser(userId),
      this.commentRepo.getCommentsCountByUser(userId),
    ]);

    await this.pdfService.generateUserActivityReport(abosoluteFilePath, {
      reportId: reportId.value,
      username: user.username.value,
      userId: user.userId.getValue().toValue() as number,
      email: userEmail.value,
      postsCreatedCount: postsCreatedCountByUser,
      downvotesCount: downvotesCountByUser,
      upvotesCount: upvotesCountByUser,
      commentsCount: commentsCountByUser,
    });

    const fileContent = await this.fileService.readFile(abosoluteFilePath);

    await this.awsS3Service.sendReport(reportId.value, fileContent);

    await this.mailService.sendUserActivityReport(userEmail.value, reportId.value, fileContent);

    await this.fileService.deleteFile(abosoluteFilePath);

    return right(Result.ok<void>());
  }
}
