import { Post as PrismaPost } from '@prisma/client';
import { UserId } from 'src/modules/User/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Post } from '../domain/post';
import { PostText } from '../domain/postText';
import { PostTitle } from '../domain/postTitle';

export class PostMapper {
  public static toDomain(raw: PrismaPost): Post {
    const postTitleOrError = PostTitle.create({ value: raw.title });
    const postTextOrError = PostText.create({ value: raw.text });
    const userIdOrError = UserId.create(new UniqueEntityID(raw.userId));

    const postOrError = Post.create(
      {
        title: postTitleOrError.getValue(),
        text: postTextOrError.getValue(),
        userId: userIdOrError.getValue(),
      },
      new UniqueEntityID(raw?.id),
    );

    return postOrError.isSuccess ? postOrError.getValue() : null;
  }

  public static toPersistance() {}
  public static toDTO() {}
}
