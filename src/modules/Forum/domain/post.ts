import { UserId } from 'src/modules/User/domain/UserId';
import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { PostId } from './postId';
import { PostText } from './postText';
import { PostTitle } from './postTitle';
import { PostVote } from './postVote';
import { PostVotes } from './postVotes';

export interface PostProps {
  userId: UserId;
  title: PostTitle;
  text?: PostText;
  votes?: PostVotes;
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

  public static create(props: PostProps, id?: UniqueEntityID): Result<Post> {
    const defaultValues: PostProps = {
      ...props,
      votes: props.votes ? props.votes : PostVotes.create([]),
    };

    const isNewPost = !!id === false;
    const post = new Post(defaultValues, id);

    if (isNewPost) {
      // post.addDomainEvent(new PostCreated(post));
      // Create with initial upvote from whomever created the post
      // post.addVote(PostVote.createUpvote(props.memberId, post.postId).getValue());
      post.addVote(PostVote.createUpvote(props.userId, post.postId).getValue());
    }

    return Result.ok<Post>(post);
  }
}
