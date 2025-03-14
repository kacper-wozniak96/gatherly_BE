import { WatchedList } from 'src/shared/domain/WatchedList';
import { Comment } from './comment';

export class Comments extends WatchedList<Comment> {
  private constructor(initialVotes: Comment[]) {
    super(initialVotes);
  }

  public compareItems(a: Comment, b: Comment): boolean {
    return a.equals(b);
  }

  public getCommentsTotalNumber() {
    return this.getItems().length ?? 0;
  }

  public static create(comments?: Comment[]): Comments {
    return new Comments(comments ? comments : []);
  }
}
