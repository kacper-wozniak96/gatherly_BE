import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Post } from '../domain/post';
import { PostTitle } from '../domain/postTitle';
import { PostText } from '../domain/postText';
import { UserId } from 'src/modules/User/domain/userId';

export class PostMapper {
  public static toDomain(raw: any): Post {
    const postOrError = Post.create(
      {
        title: PostTitle.create(raw.title).getSuccessValue(),
        text: PostText.create(raw.text).getSuccessValue(),
        userId: UserId.create(new UniqueEntityID(raw.userId)).getSuccessValue(),
      },
      new UniqueEntityID(raw?.id),
    );

    return postOrError.getSuccessValue();
  }

  public static toPersistance() {}
  public static toDTO() {}
}
