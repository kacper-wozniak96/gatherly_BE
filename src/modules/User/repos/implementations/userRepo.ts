import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '../../domain/User';
import { UserId } from '../../domain/UserId';
import { UserName } from '../../domain/UserName';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../userRepo';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const userId = user.userId.getValue().toValue();

    const exists = Number.isInteger(userId);

    if (exists) {
      // let userPassword = '';

      // if (user.password) {
      //   userPassword = await user.password.hashPassword();
      // }

      await this.prisma.user.update({
        where: { Id: user.userId.getValue().toValue() as number },
        data: {
          Username: user?.username?.value,
          AvatarS3Key: user?.avatarS3Key,
          Password: user?.password?.value,
        },
      });

      return;
    }

    // const hashedPassword = await user.props.password.hashPassword();
    await this.prisma.user.create({
      data: {
        Username: user.props.username.value,
        Password: user?.password?.value,
      },
    });
  }

  async getUserByUserId(userId: UserId | number): Promise<User | null> {
    userId = userId instanceof UserId ? (userId.getValue().toValue() as number) : userId;

    const user = await this.prisma.user.findUnique({
      where: { Id: userId },
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async getUserByUsername(username: UserName): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { Username: username.value },
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async getUsers(search: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        Username: {
          contains: search,
        },
      },
      skip: 0,
      take: 5,
    });

    // return await Promise.all(users.map((user) => UserMapper.toDomain(user)));

    return users.map((user) => UserMapper.toDomain(user));
  }
}
