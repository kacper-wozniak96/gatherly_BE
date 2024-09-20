import { UserId } from 'src/modules/User/domain/UserId';
import { Post } from '../domain/post';
import { PostId } from '../domain/postId';

export interface IPostRepo {
  save(post: Post): Promise<void>;
  getPosts(offset: number, search: string): Promise<Post[]>;
  getPostByPostId(postId: PostId | number): Promise<Post>;
  getPostsTotalCount(search: string): Promise<number>;
  getPostsCountCreatedByUser(userId: UserId): Promise<number>;
}
