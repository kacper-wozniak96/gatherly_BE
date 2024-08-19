import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UserId } from './UserId';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';

export interface UserProps {
  username: UserName;
  password: UserPassword;
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

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const isNewMember = !!id;

    const member = new User(props, id);

    if (isNewMember) {
      // Do something
    }

    return Result.ok<User>(member);
  }
}
