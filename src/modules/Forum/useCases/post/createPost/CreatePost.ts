import { UniqueEntityID } from './../../../../../shared/core/UniqueEntityID';
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';

import { UseCase } from 'src/shared/core/UseCase';
import { CreatePostDTO } from './CreatePostDTO';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostTitle } from 'src/modules/Forum/domain/postTitle';
import { PostText } from 'src/modules/Forum/domain/postText';
import { Post } from 'src/modules/Forum/domain/post';
import { PostRepoSymbol, UserRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result } from 'src/shared/core/Result';
import { CreatePostErrors } from './CreatePostErrors';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserId } from 'src/modules/User/domain/userId';

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostDTO, Promise<Result<void>>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
  ) {}

  async execute(createPostDTO: CreatePostDTO): Promise<Result<void>> {
    const userIdOrError = UserId.create(new UniqueEntityID(createPostDTO.userId));
    const postTitleOrError = PostTitle.create({ value: createPostDTO.title });
    const postTextOrError = PostText.create({ value: createPostDTO.text });

    const failedResults = Result.returnFailedResults([userIdOrError, postTitleOrError, postTextOrError]);

    if (failedResults?.length) {
      throw new ForbiddenException(new CreatePostErrors.ValueObjectValidationError(Result.returnErrorValuesFromResults(failedResults)));
    }

    const userId = userIdOrError.getSuccessValue();
    const postTitle = postTitleOrError.getSuccessValue();
    const postText = postTextOrError.getSuccessValue();

    try {
      await this.userRepo.getUserByUserId(userId);
    } catch {
      throw new ForbiddenException(new CreatePostErrors.UserDoesNotExistError());
    }

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) throw new ForbiddenException(new CreatePostErrors.UserDoesNotExistError());

    const postOrError = Post.create({
      userId: userId,
      title: postTitle,
      text: postText,
    });

    if (postOrError.isFailure) {
      throw new ForbiddenException(new CreatePostErrors.PostCreationError());
    }

    const post = postOrError.getSuccessValue();

    await this.postRepo.create(post);

    return Result.ok<void>();
  }
}
