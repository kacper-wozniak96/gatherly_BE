import { User as PrimaUser, PostComment as PrismaPostComment } from '@prisma/client';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UserId } from 'src/modules/user/domain/UserId';

import { UserMapper } from 'src/modules/user/mappers/User';
import { Comment } from '../domain/comment';
import { CommentText } from '../domain/commentText';
import { PostId } from '../domain/postId';
import { CommentDTO } from 'gatherly-types';

export class CommentMapper {
  public static toDomain(raw: PrismaPostComment & { User: PrimaUser }): Comment {
    const postIdOrError = PostId.create(new UniqueEntityID(raw.PostId));
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));
    const commentTextOrError = CommentText.create({ value: raw.Text });

    const user = UserMapper.toDomain(raw.User);

    const commentOrError = Comment.create(
      {
        postId: postIdOrError.getValue(),
        userId: userIdOrError.getValue(),
        text: commentTextOrError.getValue() as CommentText,
        user: user,
      },
      new UniqueEntityID(raw?.Id),
    );

    return commentOrError.isSuccess ? commentOrError.getValue() : null;
  }

  public static toPersistance() {}

  public static toDTO(comment: Comment): CommentDTO {
    return {
      id: comment.id.toValue() as number,
      postId: comment.postId.getValue().toValue() as number,
      user: UserMapper.toDTO(comment.user),
      text: comment.text.value,
    };
  }
}
