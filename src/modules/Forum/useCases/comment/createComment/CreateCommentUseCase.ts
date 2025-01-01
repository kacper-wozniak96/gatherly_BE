import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { Comment } from 'src/modules/Forum/domain/comment';
import { CommentText } from 'src/modules/Forum/domain/commentText';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
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
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const commentTextOrError = CommentText.create({ value: requestData.dto.comment });

    const dtoResult = Result.combine([commentTextOrError]);
    // const dtoResult = Result.combine([
    //   Result.fail<IFailedField>({
    //     message: 'siemano',
    //     field: 'comment',
    //   }),
    // ]);

    if (dtoResult.isFailure) {
      return left(new CreateCommentErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const commentText = commentTextOrError.getValue() as CommentText;

    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new CreateCommentErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new CreateCommentErrors.PostDoesntExistError());

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
