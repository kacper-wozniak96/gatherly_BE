import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/Auth/strategies/jwt.strategy';
import { Post } from 'src/modules/forum/domain/post';
import { PostText } from 'src/modules/forum/domain/postText';
import { PostTitle } from 'src/modules/forum/domain/postTitle';
import { IPostRepo } from 'src/modules/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/user/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/user/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { CreatePostErrors } from './CreatePostErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class CreatePostUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const postTitleOrError = PostTitle.create({ value: requestData.dto.title });
    const postTextOrError = PostText.create({ value: requestData.dto.text });

    const dtoResult = Result.combine([postTitleOrError, postTextOrError]);

    if (dtoResult.isFailure) {
      return left(new CreatePostErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const postTitle = postTitleOrError.getValue() as PostTitle;
    const postText = postTextOrError.getValue() as PostText;

    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new CreatePostErrors.UserDoesntExistError());

    const postOrError = Post.create({
      userId: user.userId,
      title: postTitle,
      text: postText,
    });

    if (postOrError.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const post = postOrError.getValue();

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
