import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemberMapper } from './utils/mapper';
import { Member } from './domain/member';
import { MemberId } from './domain/memberId';

export interface IMemberRepo {
  getMemberById(memberId: MemberId): Promise<Member | null>;
  getMemberByEmail(email: string): Promise<Member | null>;
  save: (member: Member) => Promise<void>;
}

@Injectable()
export class MemberRepo implements IMemberRepo {
  constructor(private prisma: PrismaService) {}

  async getMemberById(memberId: MemberId): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        Id: memberId.getValue().toValue() as number,
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
