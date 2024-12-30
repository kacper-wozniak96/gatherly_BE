import { Injectable } from '@nestjs/common';
import { EBanType } from 'gatherly-types';
import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { left, right } from 'src/shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { ResponseData as UpVotePostResponse } from '../../useCases/post/upVotePost/types';
import { ResponseData as ApplyPostBanResponse } from '../../useCases/postBan/applyPostBan/types';
import { BanType } from '../banType';
import { Post } from '../post';
import { PostBan } from '../postBan';
import { PostVote } from '../postVote';

@Injectable()
export class PostService {
  public upvotePost(post: Post, user: User, existingVotesOnPostByMember: PostVote[]): UpVotePostResponse {
    const existingUpvote: PostVote = existingVotesOnPostByMember.find((v) => v.isUpvote());

    // If already upvoted, do nothing
    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      post.removeVote(existingUpvote);
      return right(Result.ok<void>());
    }

    // If downvoted, remove the downvote
    const existingDownvote: PostVote = existingVotesOnPostByMember.find((v) => v.isDownvote());

    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      post.removeVote(existingDownvote);
      // return right(Result.ok<void>());
    }

    // Otherwise, add upvote
    const upvoteOrError = PostVote.createUpvote(user.userId, post.postId);

    if (upvoteOrError.isFailure) {
      // return left(upvoteOrError);
      return left(Result.fail<any>(upvoteOrError.getErrorValue()));
    }

    const upvote: PostVote = upvoteOrError.getValue();
    post.addVote(upvote);

    return right(Result.ok<void>());
  }

  public downvotePost(post: Post, user: User, existingVotesOnPostByMember: PostVote[]): UpVotePostResponse {
    const existingDownvote: PostVote = existingVotesOnPostByMember.find((v) => v.isDownvote());

    // If already downvoted, do nothing
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      post.removeVote(existingDownvote);
      return right(Result.ok<void>());
    }

    // If upvoted, remove the upvote
    const existingUpvote: PostVote = existingVotesOnPostByMember.find((v) => v.isUpvote());

    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      post.removeVote(existingUpvote);
      // return right(Result.ok<void>());
    }

    // Otherwise, add downvote
    const downvoteOrError = PostVote.createDownvote(user.userId, post.postId);

    if (downvoteOrError.isFailure) {
      // return left(downvoteOrError);
      return left(Result.fail<any>(downvoteOrError.getErrorValue()));
    }

    const downvote: PostVote = downvoteOrError.getValue();
    post.addVote(downvote);

    return right(Result.ok<void>());
  }

  public handleUserPostBanChange(
    post: Post,
    existingBansOnUser: PostBan[],
    bannedUserId: UserId,
    type: EBanType,
    banValue: boolean,
  ): ApplyPostBanResponse {
    const banType = BanType.create({ value: type }).getValue();
    const alreadyAppliedBan = existingBansOnUser.find((postBan) => postBan.type.equals(banType));
    console.log({ alreadyAppliedBan });
    const banOrError = PostBan.create({ postId: post.postId, userId: bannedUserId, type: banType }, alreadyAppliedBan?.id);

    if (banOrError.isFailure) return left(Result.fail<any>(banOrError.getErrorValue()));

    const ban = banOrError.getValue();

    if (alreadyAppliedBan || banValue === false) {
      post.removeBan(ban);
    } else {
      post.addBan(ban);
    }

    return right(Result.ok<void>());
  }
}
