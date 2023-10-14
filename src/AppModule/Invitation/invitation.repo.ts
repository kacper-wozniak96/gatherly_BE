import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IInvitationRepo } from './utils/types';
import { InvitationMapper } from './utils/mapper';
import { Invitation } from './Core/entity';

@Injectable()
export class InvitationRepo implements IInvitationRepo {
  constructor(private prisma: PrismaService) {}

  async create(invitation: Invitation): Promise<Invitation> {
    const createdInvitation = await this.prisma.invitation.create({
      data: {
        Gathering: { connect: { Id: invitation.gatheringId } },
        Member: { connect: { Id: invitation.memberId } },
        InvitationStatus: { connect: { Id: invitation.invitationStatusId } },
      },
    });

    return InvitationMapper.toDomain(
      createdInvitation.GatheringId,
      createdInvitation.MemberId,
    );
  }
}
