import { UserId } from 'src/modules/User/domain/UserId';
import { Comment } from '../domain/comment';
import { CommentId } from '../domain/commentId';
import { Comments } from '../domain/comments';
import { PostId } from '../domain/postId';

export interface ICommentRepo {
  save(comments: Comments): Promise<void>;
  getCommentsByPostId(PostId: PostId, offset: number): Promise<Comment[]>;
  countCommentsByPostId(PostId: PostId): Promise<number>;
  getCommentByCommentId(CommendId: CommentId): Promise<Comment>;
  getCommentsCountByUser(userId: UserId): Promise<number>;
}
