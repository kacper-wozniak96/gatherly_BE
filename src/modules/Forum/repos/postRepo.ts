import { Post } from '../domain/post';

export interface IPostRepo {
  create(post: Post): Promise<void>;
}
