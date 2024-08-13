import { Post } from '../domain/post';
import { PostId } from '../domain/postId';

export interface IPostRepo {
  save(post: Post): Promise<void>;
  getPosts(): Promise<Post[]>;
  getPostByPostId(postId: PostId): Promise<Post>;
}
