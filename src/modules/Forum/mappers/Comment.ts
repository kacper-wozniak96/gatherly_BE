import { User as PrimaUser, PostComment as PrismaPostComment } from '@prisma/client';
import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

import { UserName } from 'src/modules/User/domain/UserName';
import { UserMapper } from 'src/modules/User/mappers/User';
import { Comment } from '../domain/comment';
import { CommentText } from '../domain/commentText';
import { PostId } from '../domain/postId';
import { CommentDTO } from '../dtos/post';

export class CommentMapper {
  public static toDomain(raw: PrismaPostComment & { User: PrimaUser }): Comment {
    const postIdOrError = PostId.create(new UniqueEntityID(raw.PostId));
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));
    const commentTextOrError = CommentText.create({ value: raw.Text });

    const userOrError = User.create({
      username: UserName.create({ name: raw.User.Username }).getValue() as UserName,
      avatarS3Key: raw.User.AvatarS3Key,
    });

    const commentOrError = Comment.create(
      {
        postId: postIdOrError.getValue(),
        userId: userIdOrError.getValue(),
        text: commentTextOrError.getValue() as CommentText,
        user: userOrError.getValue(),
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
