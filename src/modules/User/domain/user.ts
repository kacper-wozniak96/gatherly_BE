import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';

export interface UserProps {
  username: UserName;
  password: UserPassword;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: Partial<UserProps>, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: Partial<UserProps>, id?: UniqueEntityID): Result<User> {
    const isNewMember = !!id;

    const member = new User(props, id);

    if (isNewMember) {
      // Do something
    }

    return Result.ok<User>(member);
  }
}
