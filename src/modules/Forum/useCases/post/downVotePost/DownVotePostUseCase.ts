import { Inject, Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { Post } from 'src/modules/Forum/domain/post';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostVote } from 'src/modules/Forum/domain/postVote';
import { PostService } from 'src/modules/Forum/domain/services/PostService';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { IPostVoteRepo } from 'src/modules/Forum/repos/postVoteRepo';
import { PostRepoSymbol, PostVoteRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { DownVotePostDTO } from './DownVotePostDTO';
import { DownVotePostErrors } from './DownVotePostErrors';
import { DownVotePostResponse } from './DownVotePostResponse';

@Injectable()
export class DownVotePostUseCase implements UseCase<DownVotePostDTO, Promise<DownVotePostResponse>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(PostVoteRepoSymbol) private readonly postVotesRepo: IPostVoteRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    private readonly postService: PostService,
  ) {}

  async execute(downVotePostDTO: DownVotePostDTO): Promise<DownVotePostResponse> {
    let user: User;
    let post: Post;
    let existingVotesOnPostByMember: PostVote[];

    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const postIdOrError = PostId.create(new UniqueEntityID(downVotePostDTO.postId));

    const dtoResult = Result.combine([userIdOrError, postIdOrError]);

    if (dtoResult.isFailure) {
      return left(new DownVotePostErrors.InvalidDataError());
    }

    const userId = userIdOrError.getValue();
    const postId = postIdOrError.getValue();

    user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new DownVotePostErrors.UserDoesntExistError());

    post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new DownVotePostErrors.PostDoesntExistError());

    existingVotesOnPostByMember = await this.postVotesRepo.getVotesForPostByUserId(post.postId, userId);

    const downvotePostResult = this.postService.downvotePost(post, user, existingVotesOnPostByMember);

    if (downvotePostResult.isLeft()) {
      return left(downvotePostResult.value);
    }

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
