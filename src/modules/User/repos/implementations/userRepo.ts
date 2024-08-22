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
    const postId = user.userId.getValue().toValue();

    const exists = Number.isInteger(postId);

    console.log({ user: user.username.value });

    if (exists) {
      await this.prisma.user.update({
        where: { Id: user.userId.getValue().toValue() as number },
        data: {
          Username: user.username.value,
        },
      });

      return;
    }

    const hashedPassword = await user.props.password.hashPassword();
    await this.prisma.user.create({
      data: {
        Username: user.props.username.value,
        Password: hashedPassword,
      },
    });
  }

  async getUserByUserId(userId: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { Id: userId.getValue().toValue() as number },
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
}
