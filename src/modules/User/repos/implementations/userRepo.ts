import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '../../domain/user';
import { UserId } from '../../domain/userId';
import { UserName } from '../../domain/UserName';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../userRepo';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const hashedPassword = await user.props.password.hashPassword();

    await this.prisma.user.create({
      data: {
        username: user.props.username.value,
        password: hashedPassword,
      },
    });
  }

  async getUserByUserId(userId: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId.getValue().toValue() as number },
    });

    return UserMapper.toDomain(user);
  }

  async getUserByUsername(username: UserName): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { username: username.value },
    });

    return UserMapper.toDomain(user);
  }
}
