import { WatchedList } from 'src/shared/domain/WatchedList';
import { PostVote } from './postVote';

export class PostVotes extends WatchedList<PostVote> {
  private constructor(initialVotes: PostVote[]) {
    super(initialVotes);
  }

  public compareItems(a: PostVote, b: PostVote): boolean {
    return a.equals(b);
  }

  public isDownvotedByUser(requestUserId: number) {
    return this.getItems().some((vote) => vote.isDownvote() && vote.userId.getValue().toValue() === requestUserId) ?? false;
  }

  public isUpVotedByUser(requestUserId: number) {
    return this.getItems().some((vote) => vote.isUpvote() && vote.userId.getValue().toValue() === requestUserId) ?? false;
  }

  public getDownVotesTotal() {
    return this.getItems().filter((vote) => vote.isDownvote()).length ?? 0;
  }

  public getUpVotesTotal() {
    return this.getItems().filter((vote) => vote.isUpvote()).length ?? 0;
  }

  public static create(initialVotes?: PostVote[]): PostVotes {
    return new PostVotes(initialVotes ? initialVotes : []);
  }
}
