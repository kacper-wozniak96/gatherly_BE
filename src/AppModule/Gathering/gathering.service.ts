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

    const invitation = gathering.addInviation(gathering, member);

    return this.invitationService.createGatheringInvitation(invitation);
  }

  async getGatheringById(gatheringId: number): Promise<Gathering> {
    return await this.gatheringRepo.getGatheringById(gatheringId);
  }
}
