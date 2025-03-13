import { UserId } from 'src/modules/User/domain/UserId';
import { Entity } from 'src/shared/core/Entity';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { PostId } from './postId';
import { Result } from 'src/shared/core/Result';

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
    return Result.ok<PostVote>(new PostVote(props, id));
  }

  public static createUpvote(userId: UserId, postId: PostId): Result<PostVote> {
    return Result.ok<PostVote>(
      new PostVote({
        userId,
        postId,
        type: EVoteType.UPVOTE,
      }),
    );
  }

  public static createDownvote(userId: UserId, postId: PostId): Result<PostVote> {
    return Result.ok<PostVote>(
      new PostVote({
        userId,
        postId,
        type: EVoteType.DOWNVOTE,
      }),
    );
  }
}
