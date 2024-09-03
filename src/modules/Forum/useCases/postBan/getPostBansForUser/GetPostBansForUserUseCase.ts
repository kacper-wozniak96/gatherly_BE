import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostBanDTO } from 'src/modules/Forum/dtos/post';
import { PostBanMapper } from 'src/modules/Forum/mappers/PostBan';
import { PostRepo } from 'src/modules/Forum/repos/implementations/postRepo';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/modules/Forum/repos/postBanRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UserId } from 'src/modules/User/domain/UserId';
import { UserRepo } from 'src/modules/User/repos/implementations/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { GetPostBansErrors } from './GetPostBansErrors';
import { GetPostBansForUserUseCaseData } from './GetPostBansForUserDTO';

type Response = Either<
  | AppError.UnexpectedError
  | GetPostBansErrors.UserDoesntExistError
  | GetPostBansErrors.PostDoesntExistError
  | GetPostBansErrors.UserDoesntOwnPostError,
  Result<PostBanDTO[]>
>;

export const GetPostBansForUserUseCaseSymbol = Symbol('GetPostBansForUserUseCase');

@Injectable()
export class GetPostBansForUserUseCase implements UseCase<GetPostBansForUserUseCaseData, Promise<Response>> {
  constructor(
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(PostRepoSymbol) private readonly postRepo: PostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: UserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(getPostBansForUserUseCaseData: GetPostBansForUserUseCaseData): Promise<Response> {
    const requestUserIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const userIdOrError = UserId.create(new UniqueEntityID(getPostBansForUserUseCaseData.userId));
    const postIdOrError = PostId.create(new UniqueEntityID(getPostBansForUserUseCaseData.postId));

    const dtoResult = Result.combine([userIdOrError, postIdOrError, requestUserIdOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const requestUserId = requestUserIdOrError.getValue();
    const userId = userIdOrError.getValue();
    const postId = postIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new GetPostBansErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new GetPostBansErrors.PostDoesntExistError());

    if (!post.isCreatedByUser(requestUserId)) return left(new GetPostBansErrors.UserDoesntOwnPostError());

    const userPostBans = await this.postBanRepo.getUserPostBans(postId, userId);

    const userPostBansDTO = userPostBans.map((ban) => PostBanMapper.toDTO(ban));

    return right(Result.ok<PostBanDTO[]>(userPostBansDTO));
  }
}
