import { WatchedList } from 'src/shared/domain/WatchedList';
import { PostBan } from './postBan';

export class PostBans extends WatchedList<PostBan> {
  private constructor(initialVotes: PostBan[]) {
    super(initialVotes);
  }

  public compareItems(a: PostBan, b: PostBan): boolean {
    return a.equals(b);
  }

  public static create(initialVotes?: PostBan[]): PostBans {
    return new PostBans(initialVotes ? initialVotes : []);
  }
}
