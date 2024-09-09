import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostText } from 'src/modules/Forum/domain/postText';
import { PostTitle } from 'src/modules/Forum/domain/postTitle';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { Changes } from 'src/utils/changes';
import { IFailedField } from 'src/utils/FailedField';
import { has } from 'src/utils/has';
import { UpdatePostUseCaseData } from './UpdatePostDTO';
import { UpdatePostErrors } from './UpdatePostErrors';

type Response = Either<
  | UpdatePostErrors.PostDoesntExistError
  | UpdatePostErrors.UserDoesntExistError
  | UpdatePostErrors.InvalidDataError
  | AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class UpdatePostUseCase implements UseCase<UpdatePostUseCaseData, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(updatePostDTO: UpdatePostUseCaseData): Promise<Response> {
    const changes = new Changes();

    const postIdOrError = PostId.create(new UniqueEntityID(updatePostDTO.postId));
    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));

    const dtoResult = Result.combine([postIdOrError, userIdOrError]);

    if (dtoResult.isFailure) return left(new AppError.UnexpectedError());

    const postId = postIdOrError.getValue();

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new UpdatePostErrors.PostDoesntExistError());

    const userId = userIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new UpdatePostErrors.UserDoesntExistError());

    if (has(updatePostDTO, 'title')) {
      const updatedTitleOrError = PostTitle.create({ value: updatePostDTO.title });

      if (updatedTitleOrError.isFailure) {
        const failedFields = [updatedTitleOrError.getErrorValue() as IFailedField];
        return left(new UpdatePostErrors.InvalidDataError(failedFields));
      }

      const updatedTitle = updatedTitleOrError.getValue() as PostTitle;

      changes.addChange(post.updateTitle(updatedTitle));
    }

    if (has(updatePostDTO, 'text')) {
      const updatedTextOrError = PostText.create({ value: updatePostDTO.text });

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
