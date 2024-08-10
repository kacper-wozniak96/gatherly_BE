import { Inject, Injectable } from '@nestjs/common';
import { UniqueEntityID } from './../../../../../shared/core/UniqueEntityID';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { Post } from 'src/modules/Forum/domain/post';
import { PostText } from 'src/modules/Forum/domain/postText';
import { PostTitle } from 'src/modules/Forum/domain/postTitle';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { CreatePostDTO, CreatePostResponseDTO } from './CreatePostDTO';
import { CreatePostErrors } from './CreatePostErrors';

type Response = Either<CreatePostErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<CreatePostResponseDTO>>;

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostDTO, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(createPostDTO: CreatePostDTO): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const postTitleOrError = PostTitle.create({ value: createPostDTO.title });
    const postTextOrError = PostText.create({ value: createPostDTO.description });

    // const failedResults = Result., postTitleOrError, postTextOrError]);
    const dtoResult = Result.combine([userIdOrError, postTitleOrError, postTextOrError]);

    // if (dtoResult?.length) {
    //   throw new ForbiddenException(new CreatePostErrors.ValueObjectValidationError(Result.returnErrorValuesFromResults(failedResults)));
    // }

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue()));
    }

    const userId = userIdOrError.getValue();
    const postTitle = postTitleOrError.getValue();
    const postText = postTextOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new CreatePostErrors.UserDoesntExistError());

    const postOrError = Post.create({
      userId: userId,
      title: postTitle,
      text: postText,
    });

    if (postOrError.isFailure) {
      // throw new ForbiddenException(new CreatePostErrors.PostCreationError());
      // return left(new AppError.UnexpectedError(postOrError));
      return left(Result.fail<any>(postOrError.getErrorValue()));
    }

    const post = postOrError.getValue();

    await this.postRepo.create(post);

    return right(Result.ok<CreatePostResponseDTO>({ post }));
  }
}
