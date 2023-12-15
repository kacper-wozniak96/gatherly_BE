import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { User } from '../domain/user';
import { UserUsername } from '../domain/userUsername';
import { UserPassword } from '../domain/userPassword';

export class UserMapper {
  public static toDomain(raw: any): User {
    console.log({ raw });

    const userOrError = User.create(
      {
        username: UserUsername.create(raw.username).getSuccessValue(),
        password: raw?.password ? UserPassword.create({ value: raw.password }).getSuccessValue() : undefined,
      },
      new UniqueEntityID(raw?.Id),
    );

    return userOrError.getSuccessValue();
  }

  public static toPersistance() {}
  public static toDTO() {}
}
