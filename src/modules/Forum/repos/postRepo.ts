import { Post } from '../domain/post';
import { PostId } from '../domain/postId';

export interface IPostRepo {
  save(post: Post): Promise<void>;
  getPosts(offset: number): Promise<Post[]>;
  getPostByPostId(postId: PostId): Promise<Post>;
  getPostsTotalCount(): Promise<number>;
}
