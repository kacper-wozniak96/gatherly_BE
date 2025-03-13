import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { ICommentRepo } from 'src/forum/repos/commentRepo';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { CommentRepoSymbol, PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { IUserRepo } from 'src/user/repos/userRepo';
import { UserRepoSymbol } from 'src/user/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { DeleteCommentErrors } from './DeleteCommentErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class DeleteCommentUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new DeleteCommentErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new DeleteCommentErrors.PostDoesntExistError());

    const comment = await this.commentRepo.getCommentByCommentId(requestData.commentId);

    if (!comment) return left(new DeleteCommentErrors.CommentDoesntExistError());

    if (!comment.isCreatedByUser(user.userId)) return left(new DeleteCommentErrors.UserDoesntOwnCommentError());

    post.deleteComment(comment);

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
