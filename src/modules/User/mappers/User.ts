import { User as PrismaUser } from '@prisma/client';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { User } from '../domain/User';
import { UserName } from '../domain/UserName';
import { UserPassword } from '../domain/UserPassword';
import { UserDTO } from '../dtos/user';

export class UserMapper {
  public static toDomain(raw: PrismaUser): User {
    const userNameOrError = UserName.create({ name: raw.Username });
    const userPasswordOrError = UserPassword.create({ value: raw.Password, hashed: true });

    const userName = (userNameOrError as Result<UserName>).getValue();
    const userPassword = (userPasswordOrError as Result<UserPassword>).getValue();
    const avatarS3Key = raw?.AvatarS3Key ?? null;

    const userOrError = User.create(
      {
        username: userName,
        password: userPassword,
        avatarS3Key: avatarS3Key,
      },
      new UniqueEntityID(raw?.Id),
    );

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static toPersistance() {}

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id.toValue() as number,
      username: user.username.value,
      avatarSignedURL: user.avatarSignedURL,
    };
  }
}
