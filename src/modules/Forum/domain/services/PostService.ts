import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/User/domain/User';
import { Result, left, right } from '../../../../shared/core/Result';
import { UpVotePostResponse } from '../../useCases/post/upVotePost/UpvotePostResponse';
import { Post } from '../post';
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
}
