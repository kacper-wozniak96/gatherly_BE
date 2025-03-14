import { Inject, Injectable } from '@nestjs/common';

import { CommentRepoSymbol, PostRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { UseCase } from 'src/shared/core/UseCase';

import { CommentMapper } from 'src/modules/forum/mappers/Comment';
import { ICommentRepo } from 'src/modules/forum/repos/commentRepo';
import { IPostRepo } from 'src/modules/forum/repos/postRepo';
import { Result } from 'src/shared/core/Result';
import { GetCommentsErrors } from './GetCommentsErrors';
import { GetCommentsResponseDTO, RequestData, ResponseData } from './types';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/modules/common/AWS';

@Injectable()
export class GetCommentsUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
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
      comments.map((comment) => {
        if (comment.user.hasSetAvatar()) {
          return this.awsS3Service.updateUserSignedUrl(comment.user);
        }
      }),
    );

    const commmentsDTO = comments.map((comment) => CommentMapper.toDTO(comment));

    return right(Result.ok<GetCommentsResponseDTO>({ comments: commmentsDTO, commentsTotalCount }));
  }
}
