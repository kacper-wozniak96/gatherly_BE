import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { EBanType } from 'gatherly-types';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostService } from 'src/forum/domain/services/PostService';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/forum/repos/postBanRepo';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { IUserRepo } from 'src/user/repos/userRepo';
import { UserRepoSymbol } from 'src/user/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { has } from 'src/utils/has';
import { ApplyPostBanErrors } from './ApplyPostBanErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class ApplyPostBanUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    private readonly postService: PostService,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new ApplyPostBanErrors.UserDoesntExistError());

    const bannedUser = await this.userRepo.getUserByUserId(requestData.bannedUserId);

    if (!bannedUser) return left(new ApplyPostBanErrors.BannedUserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new ApplyPostBanErrors.PostDoesntExistError());

    if (!post.isCreatedByUser(user.userId)) return left(new ApplyPostBanErrors.PostNotCreatedByUserError());

    const existingBansOnUser = await this.postBanRepo.getUserPostBans(post.postId, bannedUser.userId);

    const bansChanges = requestData.dto.bansChanges;

    if (has(bansChanges, EBanType.addingComments)) {
      const result = this.postService.handleUserPostBanChange(
        post,
        existingBansOnUser,
        bannedUser.userId,
        EBanType.addingComments,
        bansChanges[EBanType.addingComments],
      );

      if (result.isLeft()) {
        return left(result.value);
      }
    }

    if (has(bansChanges, EBanType.downVotingAndUpVoting)) {
      const result = this.postService.handleUserPostBanChange(
        post,
        existingBansOnUser,
        bannedUser.userId,
        EBanType.downVotingAndUpVoting,
        bansChanges[EBanType.downVotingAndUpVoting],
      );

      if (result.isLeft()) {
        return left(result.value);
      }
    }

    if (has(bansChanges, EBanType.viewingPost)) {
      const result = this.postService.handleUserPostBanChange(
        post,
        existingBansOnUser,
        bannedUser.userId,
        EBanType.viewingPost,
        bansChanges[EBanType.viewingPost],
      );

      if (result.isLeft()) {
        return left(result.value);
      }
    }

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
