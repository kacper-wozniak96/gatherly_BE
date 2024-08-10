import { User as PrismaUser } from '@prisma/client';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { User } from '../domain/User';
import { UserName } from '../domain/UserName';
import { UserPassword } from '../domain/UserPassword';

export class UserMapper {
  public static toDomain(raw: PrismaUser): User {
    const userNameOrError = UserName.create({ name: raw.username });
    const userPasswordOrError = UserPassword.create({ value: raw.password, hashed: true });

    const userOrError = User.create(
      {
        username: userNameOrError.getValue(),
        password: userPasswordOrError.getValue(),
      },
      new UniqueEntityID(raw?.id),
    );

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static toPersistance() {}
  public static toDTO() {}
}
