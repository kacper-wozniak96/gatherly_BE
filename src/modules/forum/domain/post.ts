import { User } from 'src/modules/user/domain/User';
import { UserId } from 'src/modules/user/domain/UserId';
import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Comment } from './comment';
import { Comments } from './comments';
import { PostBan } from './postBan';
import { PostBans } from './postBans';
import { PostId } from './postId';
import { PostText } from './postText';
import { PostTitle } from './postTitle';
import { PostVote } from './postVote';
import { PostVotes } from './postVotes';

export interface PostProps {
  userId: UserId;
  user?: User;
  title: PostTitle;
  createdAt?: Date;
  text?: PostText;
  votes?: PostVotes;
  comments?: Comments;
  bans?: PostBans;
  isDeleted?: boolean;
}

export class Post extends AggregateRoot<PostProps> {
  get postId(): PostId {
    return PostId.create(this._id).getValue();
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get text(): PostText {
    return this.props.text;
  }

  get title(): PostTitle {
    return this.props.title;
  }

  get votes(): PostVotes {
    return this.props.votes;
  }

  get comments(): Comments {
    return this.props.comments;
  }

  get bans(): PostBans {
    return this.props.bans;
  }

  get user(): User {
    return this.props.user;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public addVote(vote: PostVote): Result<void> {
    this.props.votes.add(vote);
    // this.addDomainEvent(new PostVotesChanged(this, vote));
    return Result.ok<void>();
  }

  public removeVote(vote: PostVote): Result<void> {
    this.props.votes.remove(vote);
    // this.addDomainEvent(new PostVotesChanged(this, vote));
    return Result.ok<void>();
  }

  public addComment(comment: Comment): Result<void> {
    this.props.comments.add(comment);
    return Result.ok<void>();
  }

  public deleteComment(comment: Comment): Result<void> {
    this.props.comments.remove(comment);
    return Result.ok<void>();
  }

  public removeComment(comment: Comment): Result<void> {
    this.props.comments.remove(comment);
    return Result.ok<void>();
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      // this.addDomainEvent(new UserDeleted(this));
      this.props.isDeleted = true;
    }
  }

  public updateTitle(title: PostTitle): Result<void> {
    this.props.title = title;
    return Result.ok<void>();
  }

  public updateText(text: PostText): Result<void> {
    this.props.text = text;
    return Result.ok<void>();
  }

  public isCreatedByUser(userId: UserId): boolean {
    return this.userId.equals(userId);
  }

  public addBan(ban: PostBan): Result<void> {
    this.props.bans.add(ban);
    return Result.ok<void>();
  }

  public removeBan(ban: PostBan): Result<void> {
    this.props.bans.remove(ban);
    return Result.ok<void>();
  }

  public static create(props: PostProps, id?: UniqueEntityID): Result<Post> {
    const defaultValues: PostProps = {
      ...props,
      votes: props?.votes ? props.votes : PostVotes.create([]),
      comments: props?.comments ? props.comments : Comments.create([]),
      bans: props?.bans ? props.bans : PostBans.create([]),
      isDeleted: props.isDeleted ? props.isDeleted : false,
      createdAt: props?.createdAt ? props.createdAt : new Date(),
    };

    const isNewPost = !!id === false;
    const post = new Post(defaultValues, id);

    if (isNewPost) {
      // post.addDomainEvent(new PostCreated(post));
      // Create with initial upvote from whomever created the post
      post.addVote(PostVote.createUpvote(props.userId, post.postId).getValue());
    }

    return Result.ok<Post>(post);
  }
}
