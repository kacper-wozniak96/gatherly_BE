import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InvitationPropsRepo } from '../utils/types/Invitation';
import { InvitationMapper } from '../mappers/Invitation';
import { Invitation } from '../domain/Invitation';

@Injectable()
export class InvitationRepo implements InvitationPropsRepo {
  constructor(private prisma: PrismaService) {}

  async create(invitation: Invitation): Promise<Invitation> {
    const createdInvitation = await this.prisma.invitation.create({
      data: {
        Gathering: { connect: { Id: invitation.GatheringId.getValue().toValue() as number } },
        Member: { connect: { Id: invitation.MemberId.getValue().toValue() as number } },
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
