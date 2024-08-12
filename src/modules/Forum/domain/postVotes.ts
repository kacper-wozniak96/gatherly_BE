import { WatchedList } from 'src/shared/domain/WatchedList';
import { PostVote } from './postVote';

export class PostVotes extends WatchedList<PostVote> {
  private constructor(initialVotes: PostVote[]) {
    super(initialVotes);
  }

  public compareItems(a: PostVote, b: PostVote): boolean {
    return a.equals(b);
  }

  public static create(initialVotes?: PostVote[]): PostVotes {
    return new PostVotes(initialVotes ? initialVotes : []);
  }
}
