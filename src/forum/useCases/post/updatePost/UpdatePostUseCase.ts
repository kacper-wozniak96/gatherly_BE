import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostText } from 'src/forum/domain/postText';
import { PostTitle } from 'src/forum/domain/postTitle';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { IUserRepo } from 'src/user/repos/userRepo';
import { UserRepoSymbol } from 'src/user/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { Changes } from 'src/utils/changes';
import { IFailedField } from 'src/utils/FailedField';
import { has } from 'src/utils/has';
import { RequestData, ResponseData } from './types';
import { UpdatePostErrors } from './UpdatePostErrors';

@Injectable()
export class UpdatePostUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const changes = new Changes();

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new UpdatePostErrors.PostDoesntExistError());

    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new UpdatePostErrors.UserDoesntExistError());

    if (!post.userId.equals(user.userId)) return left(new UpdatePostErrors.UserIsNotPostAuthorError());

    if (has(requestData.dto, 'title')) {
      console.log({ requestData });

      const updatedTitleOrError = PostTitle.create({ value: requestData.dto.title });

      console.log({ updatedTitleOrError });

      if (updatedTitleOrError.isFailure) {
        const failedFields = [updatedTitleOrError.getErrorValue() as IFailedField];
        return left(new UpdatePostErrors.InvalidDataError(failedFields));
      }

      const updatedTitle = updatedTitleOrError.getValue() as PostTitle;

      changes.addChange(post.updateTitle(updatedTitle));
    }

    if (has(requestData.dto, 'text')) {
      const updatedTextOrError = PostText.create({ value: requestData.dto.text });

      if (updatedTextOrError.isFailure) {
        const failedFields = [updatedTextOrError.getErrorValue() as IFailedField];
        return left(new UpdatePostErrors.InvalidDataError(failedFields));
      }

      const updatedText = updatedTextOrError.getValue() as PostText;

      changes.addChange(post.updateText(updatedText));
    }

    if (changes.getCombinedChangesResult().isFailure) return left(new AppError.UnexpectedError());

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
