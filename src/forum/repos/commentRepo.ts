import { UserId } from 'src/user/domain/UserId';
import { Comment } from '../domain/comment';
import { CommentId } from '../domain/commentId';
import { Comments } from '../domain/comments';
import { PostId } from '../domain/postId';

export interface ICommentRepo {
  save(comments: Comments): Promise<void>;
  getCommentsByPostId(PostId: PostId | number, offset: number): Promise<Comment[]>;
  countCommentsByPostId(PostId: PostId | number): Promise<number>;
  getCommentByCommentId(CommendId: CommentId | number): Promise<Comment>;
  getCommentsCountByUser(userId: UserId): Promise<number>;
}
