import { EBanType } from 'gatherly-types';
import { BanType } from 'src/forum/domain/banType';
import { PostBan, PostBanProps } from 'src/forum/domain/postBan';
import { PostId } from 'src/forum/domain/postId';
import { UserId } from 'src/user/domain/UserId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

export const createStubPostBan = (type: EBanType): PostBan => {
  const postId = PostId.create(new UniqueEntityID(1)).getValue();
  const userId = UserId.create(new UniqueEntityID(1)).getValue();
  const banType = BanType.create({ value: type }).getValue();

  const postBanProps = {
    postId,
    userId,
    type: banType,
  } as PostBanProps;

  return PostBan.create(postBanProps).getValue();
};
