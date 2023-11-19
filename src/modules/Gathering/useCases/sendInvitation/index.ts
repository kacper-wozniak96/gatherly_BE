import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { InvitationRepoSymbol } from '../../utils/Symbols/Invitation';
import { InvitationPropsRepo } from '../../utils/types/Invitation';
import { ISendInvitationUseCase } from './types';
import { IGetGatheringByIdUseCase } from '../getGatheringById/types';
import { MemberRepoSymbol } from 'src/modules/Member/utils/symbols';
import { IGetMemberByIdUseCase } from 'src/modules/Member/use-cases/getMemberById/types';
import { GatheringId } from '../../domain/gatheringId';
import { MemberId } from 'src/modules/Member/domain/memberId';

@Injectable()
export class SendInvitationUseCase implements ISendInvitationUseCase {
  constructor(
    @Inject(InvitationRepoSymbol)
    private readonly invitationRepo: InvitationPropsRepo,

    @Inject(InvitationRepoSymbol)
    private readonly getGatheringByIdUseCase: IGetGatheringByIdUseCase,

    @Inject(MemberRepoSymbol)
    private readonly getMemberByIdUseCase: IGetMemberByIdUseCase,
  ) {}

  async execute(gatheringId: GatheringId, memberId: MemberId): Promise<void> {
    const [gathering, member] = await Promise.all([
      this.getGatheringByIdUseCase.execute(gatheringId),
      this.getMemberByIdUseCase.execute(memberId),
    ]);

    const invitation = gathering.sendInviation(gathering, member);

    await this.invitationRepo.create(invitation);
  }
}
