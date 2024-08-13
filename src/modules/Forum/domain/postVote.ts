import { UserId } from 'src/modules/User/domain/UserId';
import { Entity } from 'src/shared/core/Entity';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Result } from '../../../shared/core/Result';
import { PostId } from './postId';

export enum EVoteType {
  UPVOTE = 1,
  DOWNVOTE,
}

interface PostVoteProps {
  postId: PostId;
  userId: UserId;
  type: EVoteType;
}

export class PostVote extends Entity<PostVoteProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get postId(): PostId {
    return this.props.postId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get type(): EVoteType {
    return this.props.type;
  }

  public isUpvote(): boolean {
    return this.props.type === EVoteType.UPVOTE;
  }

  public isDownvote(): boolean {
    return this.props.type === EVoteType.DOWNVOTE;
  }

  private constructor(props: PostVoteProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PostVoteProps, id?: UniqueEntityID): Result<PostVote> {
    // const guardResult = Guard.againstNullOrUndefinedBulk([
    //   { argument: props.memberId, argumentName: 'memberId' },
    //   { argument: props.postId, argumentName: 'postId' },
    //   { argument: props.type, argumentName: 'type' },
    // ]);

    // if (guardResult.isFailure) {
    //   return Result.fail<PostVote>(guardResult.getErrorValue());
    // } else {
    // }
    return Result.ok<PostVote>(new PostVote(props, id));
  }

  public static createUpvote(userId: UserId, postId: PostId): Result<PostVote> {
    // const memberGuard = Guard.againstNullOrUndefined(userId, 'memberId');
    // const postGuard = Guard.againstNullOrUndefined(postId, 'postId');

    // if (memberGuard.isFailure) {
    //   return Result.fail<PostVote>(memberGuard.getErrorValue());
    // }

    // if (postGuard.isFailure) {
    //   return Result.fail<PostVote>(postGuard.getErrorValue());
    // }

    return Result.ok<PostVote>(
      new PostVote({
        userId,
        postId,
        type: EVoteType.UPVOTE,
      }),
    );
  }

  public static createDownvote(userId: UserId, postId: PostId): Result<PostVote> {
    // const memberGuard = Guard.againstNullOrUndefined(memberId, 'memberId');
    // const postGuard = Guard.againstNullOrUndefined(postId, 'postId');

    // if (memberGuard.isFailure) {
    //   return Result.fail<PostVote>(memberGuard.getErrorValue());
    // }

    // if (postGuard.isFailure) {
    //   return Result.fail<PostVote>(postGuard.getErrorValue());
    // }

    return Result.ok<PostVote>(
      new PostVote({
        userId,
        postId,
        type: EVoteType.DOWNVOTE,
      }),
    );
  }
}
