import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostService } from 'src/modules/Forum/domain/services/PostService';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { IPostVoteRepo } from 'src/modules/Forum/repos/postVoteRepo';
import { PostRepoSymbol, PostVoteRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { DownVotePostErrors } from './DownVotePostErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class DownVotePostUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostVoteRepoSymbol) private readonly postVotesRepo: IPostVoteRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    private readonly postService: PostService,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new DownVotePostErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new DownVotePostErrors.PostDoesntExistError());

    const existingVotesOnPostByMember = await this.postVotesRepo.getVotesForPostByUserId(post.postId, user.userId);

    const downvotePostResult = this.postService.downvotePost(post, user, existingVotesOnPostByMember);

    if (downvotePostResult.isLeft()) {
      return left(downvotePostResult.value);
    }

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
