import { EBanType } from 'gatherly-types';
import { UserId } from 'src/modules/User/domain/UserId';
import { Entity } from 'src/shared/core/Entity';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Result } from 'src/shared/core/Result';
import { BanType } from './banType';
import { PostId } from './postId';

export interface PostBanProps {
  postId: PostId;
  userId: UserId;
  type: BanType;
}

export class PostBan extends Entity<PostBanProps> {
  private constructor(props: PostBanProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get postId(): PostId {
    return this.props.postId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get type(): BanType {
    return this.props.type;
  }

  public static isUserBanned(postBans: PostBan[], banType: EBanType): boolean {
    return postBans.some((ban) => ban.type.value === banType);
  }

  public static create(props: PostBanProps, id?: UniqueEntityID): Result<PostBan> {
    return Result.ok<PostBan>(new PostBan(props, id));
  }
}
