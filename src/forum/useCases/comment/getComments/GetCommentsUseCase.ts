import { Inject, Injectable } from '@nestjs/common';

import { CommentRepoSymbol, PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { UseCase } from 'src/shared/core/UseCase';

import { CommentMapper } from 'src/forum/mappers/Comment';
import { ICommentRepo } from 'src/forum/repos/commentRepo';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { Result } from 'src/shared/core/Result';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { GetCommentsErrors } from './GetCommentsErrors';
import { GetCommentsResponseDTO, RequestData, ResponseData } from './types';

@Injectable()
export class GetCommentsUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
    // @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) {
      return left(new GetCommentsErrors.PostDoesntExistError());
    }

    const [comments, commentsTotalCount] = await Promise.all([
      this.commentRepo.getCommentsByPostId(requestData.postId, requestData.offset),
      this.commentRepo.countCommentsByPostId(requestData.postId),
    ]);

    await Promise.all(
      comments.map(async (comment) => {
        if (comment.user.hasSetAvatar()) {
          // const signedURL = await this.awsS3Service.getFileUrl(comment.user.avatarS3Key);
          // comment.user.updateUserAvatarSignedUrl(signedURL);
        }
      }),
    );

    const commmentsDTO = comments.map((comment) => CommentMapper.toDTO(comment));

    return right(Result.ok<GetCommentsResponseDTO>({ comments: commmentsDTO, commentsTotalCount }));
  }
}
