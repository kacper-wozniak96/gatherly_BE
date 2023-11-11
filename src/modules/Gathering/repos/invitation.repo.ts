import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IInvitationRepo } from '../utils/types/Invitation';
import { InvitationMapper } from '../mappers/Invitation';
import { Invitation } from '../domain/entities/Invitation';

@Injectable()
export class InvitationRepo implements IInvitationRepo {
  constructor(private prisma: PrismaService) {}

  async create(invitation: Invitation): Promise<Invitation> {
    const createdInvitation = await this.prisma.invitation.create({
      data: {
        Gathering: { connect: { Id: invitation.GatheringId } },
        Member: { connect: { Id: invitation.MemberId } },
        InvitationStatus: { connect: { Id: invitation.InvitationStatusId } },
      },
    });

    return InvitationMapper.toDomain(createdInvitation);
  }

  async getById(invitationId: number): Promise<Invitation> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { Id: invitationId },
    });

    return InvitationMapper.toDomain(invitation);
  }
}
