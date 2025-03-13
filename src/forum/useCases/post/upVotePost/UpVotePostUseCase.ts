import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { EBanType } from 'gatherly-types';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostBan } from 'src/forum/domain/postBan';
import { PostService } from 'src/forum/domain/services/PostService';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/forum/repos/postBanRepo';
import { IPostRepo } from 'src/forum/repos/postRepo';
import { IPostVoteRepo } from 'src/forum/repos/postVoteRepo';
import { PostRepoSymbol, PostVoteRepoSymbol } from 'src/forum/repos/utils/symbols';
import { IUserRepo } from 'src/user/repos/userRepo';
import { UserRepoSymbol } from 'src/user/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { UpVotePostErrors } from './UpVotePostErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class UpVotePostUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostVoteRepoSymbol) private readonly postVotesRepo: IPostVoteRepo,
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    private readonly postService: PostService,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new UpVotePostErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new UpVotePostErrors.PostDoesntExistError());

    const existingBansOnUser = await this.postBanRepo.getUserPostBans(post.postId, this.request.user.userId);

    const isUserBanned = PostBan.isUserBanned(existingBansOnUser, EBanType.downVotingAndUpVoting);

    if (isUserBanned) return left(new UpVotePostErrors.UserBannedFromVotingError());

    const existingVotesOnPostByMember = await this.postVotesRepo.getVotesForPostByUserId(post.postId, user.userId);

    const upvotePostResult = this.postService.upvotePost(post, user, existingVotesOnPostByMember);

    if (upvotePostResult.isLeft()) {
      return left(new AppError.UnexpectedError());
    }

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
