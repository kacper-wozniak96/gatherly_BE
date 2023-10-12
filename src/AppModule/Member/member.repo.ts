import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IMemberRepo } from './utils/types';
import { MemberMapper } from './utils/mapper';

@Injectable()
export class MemberRepo implements IMemberRepo {
  constructor(private prisma: PrismaService) {}

  async getById(memberId: any): Promise<any> {
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }
}
