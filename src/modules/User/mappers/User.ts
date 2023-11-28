import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { User } from '../domain/user';
import { UserUsername } from '../domain/userUsername';

export class UserMapper {
  public static toDomain(raw: any): User {
    const userOrError = User.create(
      {
        username: UserUsername.create(raw.username).getSuccessValue(),
      },
      new UniqueEntityID(raw?.Id),
    );

    return userOrError.getSuccessValue();
  }

  public static toPersistance() {}
  public static toDTO() {}
}
