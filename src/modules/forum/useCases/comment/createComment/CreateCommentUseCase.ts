import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { EBanType } from 'gatherly-types';
import { CustomRequest } from 'src/modules/Auth/strategies/jwt.strategy';
import { Comment } from 'src/modules/forum/domain/comment';
import { CommentText } from 'src/modules/forum/domain/commentText';
import { PostBan } from 'src/modules/forum/domain/postBan';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/modules/forum/repos/postBanRepo';
import { IPostRepo } from 'src/modules/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/user/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/user/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { CreateCommentErrors } from './CreateCommentErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class CreateCommentUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new CreateCommentErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new CreateCommentErrors.PostDoesntExistError());

    const existingBansOnUser = await this.postBanRepo.getUserPostBans(post.postId, this.request.user.userId);

    const isUserBanned = PostBan.isUserBanned(existingBansOnUser, EBanType.addingComments);

    if (isUserBanned) return left(new CreateCommentErrors.UserBannedFromAddingCommentsError());

    const commentTextOrError = CommentText.create({ value: requestData.dto.comment });

    const dtoResult = Result.combine([commentTextOrError]);

    if (dtoResult.isFailure) {
      return left(new CreateCommentErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const commentText = commentTextOrError.getValue() as CommentText;

    const commentOrError = Comment.create({
      userId: user.userId,
      text: commentText,
      postId: post.postId,
    });

    if (commentOrError.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const comment = commentOrError.getValue();

    post.addComment(comment);

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
