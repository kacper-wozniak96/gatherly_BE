import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IUserRepo } from '../userRepo';
import { User } from '../../domain/user';
import { UserId } from '../../domain/userId';
import { UserMapper } from '../../mappers/User';
import { UserUsername } from '../../domain/userUsername';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        username: user.props.username.value,
        password: user.props.password.value,
      },
    });
  }

  async getUserByUserId(userId: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId.getValue().toValue() as number },
      select: {
        id: true,
        username: true,
      },
    });

    // if (!user) throw new Error('User not found');

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async getUserByUsername(username: UserUsername): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { username: username.value },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }
}
