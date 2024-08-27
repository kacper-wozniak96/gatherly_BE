import { Inject, Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostId } from 'src/modules/Forum/domain/postId';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { DeletePostUseCaseData } from './DeletePostDTO';
import { DeletePostErrors } from './DeletePostErrors';

type Response = Either<DeletePostErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

@Injectable()
export class DeletePostUseCase implements UseCase<DeletePostUseCaseData, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(deletePostUseCaseData: DeletePostUseCaseData): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const postIdOrError = PostId.create(new UniqueEntityID(deletePostUseCaseData.postId));

    const dtoResult = Result.combine([userIdOrError, postIdOrError]);

    if (dtoResult.isFailure) {
      return left(new DeletePostErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const userId = userIdOrError.getValue();
    const postId = postIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new DeletePostErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new DeletePostErrors.PostDoesntExistError());

    if (!post.isCreatedByUser(userId)) return left(new DeletePostErrors.UserDoesntOwnPostError());

    post.delete();

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
