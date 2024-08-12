import { Post as PrismaPost } from '@prisma/client';
import { UserId } from 'src/modules/User/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Post } from '../domain/post';
import { PostText } from '../domain/postText';
import { PostTitle } from '../domain/postTitle';

export class PostMapper {
  public static toDomain(raw: PrismaPost): Post {
    const postTitleOrError = PostTitle.create({ value: raw.Title });
    const postTextOrError = PostText.create({ value: raw.Text });
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));

    const postOrError = Post.create(
      {
        title: postTitleOrError.getValue() as PostTitle,
        text: postTextOrError.getValue() as PostText,
        userId: userIdOrError.getValue(),
      },
      new UniqueEntityID(raw?.Id),
    );

    return postOrError.isSuccess ? postOrError.getValue() : null;
  }

  public static toPersistance(post: Post): any {
    return {
      Title: post.title.value,
      Text: post.text.value,
      User: { connect: { Id: post.userId.getValue().toValue() } },
    };
  }
  public static toDTO() {}
}
