import { Injectable } from '@nestjs/common';
import { EBanType } from 'gatherly-types';
import { User } from 'src/user/domain/User';
import { UserId } from 'src/user/domain/UserId';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { ResponseData as UpVotePostResponse } from '../../useCases/post/upVotePost/types';
import { ApplyPostBanErrors } from '../../useCases/postBan/applyPostBan/ApplyPostBanErrors';
import { ResponseData as ApplyPostBanResponse } from '../../useCases/postBan/applyPostBan/types';
import { BanType } from '../banType';
import { BanValue } from '../banValue';
import { Post } from '../post';
import { PostBan } from '../postBan';
import { PostVote } from '../postVote';

@Injectable()
export class PostService {
  public upvotePost(post: Post, user: User, existingVotesOnPostByMember: PostVote[]): UpVotePostResponse {
    const existingUpvote: PostVote = existingVotesOnPostByMember.find((v) => v.isUpvote());

    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      post.removeVote(existingUpvote);
      return right(Result.ok<void>());
    }

    const existingDownvote: PostVote = existingVotesOnPostByMember.find((v) => v.isDownvote());

    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      post.removeVote(existingDownvote);
    }

    const upvoteOrError = PostVote.createUpvote(user.userId, post.postId);

    if (upvoteOrError.isFailure) {
      return left(Result.fail<any>(upvoteOrError.getErrorValue()));
    }

    const upvote: PostVote = upvoteOrError.getValue();
    post.addVote(upvote);

    return right(Result.ok<void>());
  }

  public downvotePost(post: Post, user: User, existingVotesOnPostByMember: PostVote[]): UpVotePostResponse {
    const existingDownvote: PostVote = existingVotesOnPostByMember.find((v) => v.isDownvote());

    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      post.removeVote(existingDownvote);
      return right(Result.ok<void>());
    }

    const existingUpvote: PostVote = existingVotesOnPostByMember.find((v) => v.isUpvote());

    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      post.removeVote(existingUpvote);
    }

    const downvoteOrError = PostVote.createDownvote(user.userId, post.postId);

    if (downvoteOrError.isFailure) {
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
    const banTypeOrError = BanType.create({ value: type });
    const banValueOrError = BanValue.create({ value: banValue });

    const result = Result.combine([banTypeOrError, banValueOrError]);

    if (result.isFailure) {
      left(new ApplyPostBanErrors.InvalidDataError());
    }

    const banType = banTypeOrError.getValue();

    const alreadyAppliedBan = existingBansOnUser.find((postBan) => postBan.type.equals(banType as BanType));

    const banOrError = PostBan.create({ postId: post.postId, userId: bannedUserId, type: banType as BanType }, alreadyAppliedBan?.id);

    if (banOrError.isFailure) return left(new ApplyPostBanErrors.InvalidDataError());

    const ban = banOrError.getValue();

    if (alreadyAppliedBan || banValue === false) {
      post.removeBan(ban);
    } else {
      post.addBan(ban);
    }

    return right(Result.ok<void>());
  }
}
