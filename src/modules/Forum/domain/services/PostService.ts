import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { Result, left, right } from '../../../../shared/core/Result';
import { UpVotePostResponse } from '../../useCases/post/upVotePost/UpvotePostResponse';
import { ApplyPostBanResponse } from '../../useCases/postBan/applyPostBan/ApplyPostBanResponse';
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

  public applyPostBan(post: Post, existingBansOnUser: PostBan[], banType: BanType, bannedUserId: UserId): ApplyPostBanResponse {
    const isBanAlreadyAppliedToUser = existingBansOnUser.some((postBan) => postBan.type.equals(banType));

    if (isBanAlreadyAppliedToUser) {
      return right(Result.ok<void>());
    }

    const banOrError = PostBan.create({ postId: post.postId, userId: bannedUserId, type: banType });

    if (banOrError.isFailure) {
      return left(Result.fail<any>(banOrError.getErrorValue()));
    }

    const ban: PostBan = banOrError.getValue();

    post.addBan(ban);

    return right(Result.ok<void>());
  }
}
