import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IMemberRepo } from './utils/types';
import { MemberMapper } from './utils/mapper';
import { Member } from './domain/member';

@Injectable()
export class MemberRepo implements IMemberRepo {
  constructor(private prisma: PrismaService) {}

  async getMemberById(memberId: number): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        Id: memberId,
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }

  async getMemberByEmail(email: string): Promise<Member | null> {
    const member = await this.prisma.member.findFirst({
      where: {
        Email: email,
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }

  async save(member: Member): Promise<void> {
    await this.prisma.member.create({
      data: MemberMapper.toPersistence(member),
    });

    return;
  }
}
