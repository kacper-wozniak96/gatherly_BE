import { PostBan as PrismaPostBan } from '@prisma/client';
import { UserId } from 'src/modules/User/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

import { BanType } from '../domain/banType';
import { PostBan } from '../domain/postBan';
import { PostId } from '../domain/postId';

export class PostBanMapper {
  public static toDomain(raw: PrismaPostBan): PostBan {
    const postIdOrError = PostId.create(new UniqueEntityID(raw.PostId));
    const userIdOrError = UserId.create(new UniqueEntityID(raw.UserId));
    const banTypeOrError = BanType.create({ value: raw.BanTypeId });

    const postBanOrError = PostBan.create({
      postId: postIdOrError.getValue(),
      userId: userIdOrError.getValue(),
      type: banTypeOrError.getValue(),
    });

    return postBanOrError.isSuccess ? postBanOrError.getValue() : null;
  }

  public static toPersistance() {}

  public static toDTO() {}
}