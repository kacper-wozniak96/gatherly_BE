import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UserUsername } from './userUsername';
import { UserPassword } from './userPassword';

export interface UserProps {
  username: UserUsername;
  password: UserPassword;
}

export class User extends AggregateRoot<Partial<UserProps>> {
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
