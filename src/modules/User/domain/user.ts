import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UserId } from './UserId';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';

export interface UserProps {
  username: UserName;
  password?: UserPassword;
  avatarS3Key?: string;

  avatarsignedURl?: string;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get username(): UserName {
    return this.props.username;
  }

  get avatarS3Key(): string {
    return this.props.avatarS3Key;
  }

  get avatarSignedURL(): string {
    return this.props.avatarsignedURl;
  }

  updateUsername(username: UserName): Result<void> {
    this.props.username = username;
    return Result.ok<void>();
  }

  updateAvatarS3Key(avatarS3Key: string): Result<void> {
    this.props.avatarS3Key = avatarS3Key;
    return Result.ok<void>();
  }

  updateUserAvatarSignedUrl(avatarsignedURl: string): Result<void> {
    this.props.avatarsignedURl = avatarsignedURl;
    return Result.ok<void>();
  }

  hasSetAvatar(): boolean {
    return !!this.props.avatarS3Key;
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const isNewMember = !!id;

    const member = new User(props, id);

    if (isNewMember) {
      // Do something
    }

    return Result.ok<User>(member);
  }
}
