import { Inject, Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { BanType } from 'src/modules/Forum/domain/banType';
import { Post } from 'src/modules/Forum/domain/post';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostService } from 'src/modules/Forum/domain/services/PostService';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/modules/Forum/repos/postBanRepo';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { left, Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { ApplyPostBanUseCaseData } from './ApplyPostBanDTO';
import { ApplyPostBanErrors } from './ApplyPostBanErrors';
import { ApplyPostBanResponse } from './ApplyPostBanResponse';

@Injectable()
export class ApplyPostBanUseCase implements UseCase<ApplyPostBanUseCaseData, Promise<ApplyPostBanResponse>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    private readonly postService: PostService,
  ) {}

  async execute(applyPostBanUseCaseData: ApplyPostBanUseCaseData): Promise<ApplyPostBanResponse> {
    let user: User;
    let bannedUser: User;
    let post: Post;

    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const bannedUserIdOrError = UserId.create(new UniqueEntityID(applyPostBanUseCaseData.dto.bannedUserId));
    const postIdOrError = PostId.create(new UniqueEntityID(applyPostBanUseCaseData.postId));
    const banTypeOrError = BanType.create({ value: applyPostBanUseCaseData.dto.postTypeOfBan });

    const dtoResult = Result.combine([userIdOrError, postIdOrError, bannedUserIdOrError, banTypeOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const userId = userIdOrError.getValue();
    const postId = postIdOrError.getValue();
    const bannedUserId = bannedUserIdOrError.getValue();
    const banType = banTypeOrError.getValue();

    user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new ApplyPostBanErrors.UserDoesntExistError());

    bannedUser = await this.userRepo.getUserByUserId(bannedUserId);

    if (!bannedUser) return left(new ApplyPostBanErrors.BannedUserDoesntExistError());

    post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new ApplyPostBanErrors.PostDoesntExistError());

    if (!post.isCreatedByUser(userId)) return left(new ApplyPostBanErrors.PostNotCreatedByUserError());

    const existingBansOnUser = await this.postBanRepo.getUserPostBans(post.postId, bannedUserId);

    const result = this.postService.applyPostBan(post, existingBansOnUser, banType, bannedUserId);

    if (result.isLeft()) {
      return left(new AppError.UnexpectedError());
    }

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
