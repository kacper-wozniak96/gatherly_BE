import { Inject, Injectable } from '@nestjs/common';

import { CommentRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';

import { PostId } from 'src/modules/Forum/domain/postId';
import { CommentMapper } from 'src/modules/Forum/mappers/Comment';
import { ICommentRepo } from 'src/modules/Forum/repos/commentRepo';
import { AppError } from 'src/shared/core/AppError';
import { Either, left } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { GetCommentsRequestDTO, GetCommentsResponseDTO } from './GetCommentsDTO';

type Response = Either<AppError.UnexpectedError, Result<GetCommentsResponseDTO>>;

@Injectable()
export class GetCommentsUseCase implements UseCase<GetCommentsRequestDTO, Promise<Response>> {
  constructor(
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(dto: GetCommentsRequestDTO): Promise<Response> {
    const PostIdOrError = PostId.create(new UniqueEntityID(dto.postId));

    if (PostIdOrError.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const postId = PostIdOrError.getValue();

    try {
      const [comments, commentsTotalCount] = await Promise.all([
        this.commentRepo.getCommentsByPostId(postId, dto.offset),
        this.commentRepo.countCommentsByPostId(postId),
      ]);

      await Promise.all(
        comments.map(async (comment) => {
          if (comment.user.hasSetAvatar()) {
            const signedURL = await this.awsS3Service.getFileUrl(comment.user.avatarS3Key);

            comment.user.updateUserAvatarSignedUrl(signedURL);
          }
        }),
      );

      const commmentsDTO = comments.map((comment) => CommentMapper.toDTO(comment));

      return right(Result.ok<GetCommentsResponseDTO>({ comments: commmentsDTO, commentsTotalCount }));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
