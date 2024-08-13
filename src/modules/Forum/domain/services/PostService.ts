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
      return right(Result.ok<void>());
    }

    // If downvoted, remove the downvote
    const existingDownvote: PostVote = existingVotesOnPostByMember.find((v) => v.isDownvote());

    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      post.removeVote(existingDownvote);
      return right(Result.ok<void>());
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
}
