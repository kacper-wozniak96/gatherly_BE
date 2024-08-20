import { PostComment as PrismaPostComment } from '@prisma/client';
import { UserId } from 'src/modules/User/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Comment } from '../domain/comment';
import { CommentText } from '../domain/commentText';
import { PostId } from '../domain/postId';

export class PostCommentMapper {
  public static toDomain(raw: PrismaPostComment): Comment {
    const postIdOrError = PostId.create(new UniqueEntityID(raw.PostId));
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));
    const commentTextOrError = CommentText.create({ value: raw.Text });

    const postCommentOrError = Comment.create(
      {
        postId: postIdOrError.getValue(),
        userId: userIdOrError.getValue(),
        text: commentTextOrError.getValue(),
      },
      new UniqueEntityID(raw?.Id),
    );

    return postCommentOrError.isSuccess ? postCommentOrError.getValue() : null;
  }

  public static toPersistance() {}
  public static toDTO() {}
}
