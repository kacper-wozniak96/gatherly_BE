import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IInvitation, IInvitationRepo } from './utils/types';
import { InvitationMapper } from './utils/mapper';

@Injectable()
export class InvitationRepo implements IInvitationRepo {
  constructor(private prisma: PrismaService) {}

  async create(data: IInvitation): Promise<IInvitation> {
    const invitation = await this.prisma.invitation.create({
      data: {
        Gathering: { connect: { Id: data.gatheringId } },
        Member: { connect: { Id: data.memberId } },
        InvitationStatus: { connect: { Id: data.invitationStatusId } },
      },
    });

    return InvitationMapper.toDomain(invitation);
  }
}
