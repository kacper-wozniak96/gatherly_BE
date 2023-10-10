import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IUserService {
  constructor(private prisma: PrismaService) {}

  async getUserWithId1(): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: 1 },
    });
  }
}
