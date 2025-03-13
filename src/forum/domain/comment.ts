import { User } from 'src/user/domain/User';
import { UserId } from 'src/user/domain/UserId';
import { Entity } from 'src/shared/core/Entity';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { CommentId } from './commentId';
import { CommentText } from './commentText';
import { PostId } from './postId';
import { Result } from 'src/shared/core/Result';

export interface CommentProps {
  userId: UserId;
  text: CommentText;
  postId: PostId;
  user?: User;
}

export class Comment extends Entity<CommentProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get commentId(): CommentId {
    return CommentId.create(this._id).getValue();
  }

  get postId(): PostId {
    return this.props.postId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get text(): CommentText {
    return this.props.text;
  }

  get user(): User {
    return this.props.user;
  }

  public isCreatedByUser(userId: UserId): boolean {
    return this.props.userId.equals(userId);
  }

  private constructor(props: CommentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: CommentProps, id?: UniqueEntityID): Result<Comment> {
    const defaultCommentProps: CommentProps = {
      ...props,
    };

    const comment = new Comment(defaultCommentProps, id);

    return Result.ok<Comment>(comment);
  }
}
