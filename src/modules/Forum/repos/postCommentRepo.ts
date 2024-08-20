import { Comments } from '../domain/comments';

export interface ICommentRepo {
  save(comments: Comments): Promise<void>;
}
