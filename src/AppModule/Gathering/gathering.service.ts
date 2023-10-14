import { ForbiddenException, Inject } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import {
  IGatheringCreationDTO,
  IGatheringRepo,
  IGatheringService,
} from './utils/types';
import { GatheringRepoSymbol } from './utils/symbols';
import { Gathering } from './Core/entity';
import { MemberServiceSymbol } from '../Member/utils/symbols';
import { IMemberService } from '../Member/utils/types';
import { IInvitationService } from '../Invitation/utils/types';
import { InvitationServiceSymbol } from '../Invitation/utils/symbols';
import { Invitation } from '../Invitation/Core/entity';

@Injectable()
export class GatheringService implements IGatheringService {
  constructor(
    @Inject(GatheringRepoSymbol)
    private readonly gatheringRepo: IGatheringRepo,

    @Inject(MemberServiceSymbol)
    private readonly memeberSerive: IMemberService,

    @Inject(InvitationServiceSymbol)
    private readonly invitationService: IInvitationService,
  ) {}

  async create(
    gatheringData: IGatheringCreationDTO,
    maxiumNumberOfAttendess?: number,
    invitationsValidBeforeInHours?: number,
  ): Promise<Gathering> {
    const creator = await this.memeberSerive.getMemberById(
      gatheringData?.CreatorId,
    );

    if (!creator) throw new ForbiddenException('Creator not found');

    const gathering = Gathering.create(
      gatheringData,
      undefined,
      maxiumNumberOfAttendess,
      invitationsValidBeforeInHours,
    );

    return await this.gatheringRepo.create(gathering);
  }

  async inviteToGathering(
    gatheringId: number,
    memberIdToInvite: number,
  ): Promise<any> {
    const [gathering, member] = await Promise.all([
      this.getGatheringById(gatheringId),
      this.memeberSerive.getMemberById(memberIdToInvite),
    ]);

    if (!member || !gathering) {
      throw new ForbiddenException('Member and/or gathering does not exist');
    }

    if (gathering.CreatorId === memberIdToInvite) {
      throw new ForbiddenException(
        'Cant send invitation to the gathering creator',
      );
    }

    if (new Date(gathering.ScheduledAt) < new Date()) {
      throw new ForbiddenException(
        'Cant send invitation for gathering in the past',
      );
    }

    return this.invitationService.createGatheringInvitation(
      Invitation.create(gathering.Id, member.Id),
    );
  }

  async getGatheringById(gatheringId: number): Promise<Gathering> {
    return await this.gatheringRepo.getGatheringById(gatheringId);
  }
}
