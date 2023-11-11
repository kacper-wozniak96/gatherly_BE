import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { InvitationRepoSymbol } from '../../utils/Symbols/Invitation';
import { IInvitationRepo } from '../../utils/types/Invitation';
import { ISendInvitationUseCase } from './types';
import { IGetGatheringByIdUseCase } from 'src/AppModule/Gathering/use-cases/getGatheringById/types';
import { MemberRepoSymbol } from 'src/AppModule/Member/utils/symbols';
import { IGetMemberByIdUseCase } from 'src/AppModule/Member/use-cases/getMemberById/types';

@Injectable()
export class SendInvitationUseCase implements ISendInvitationUseCase {
  constructor(
    @Inject(InvitationRepoSymbol)
    private readonly invitationRepo: IInvitationRepo,

    @Inject(InvitationRepoSymbol)
    private readonly getGatheringByIdUseCase: IGetGatheringByIdUseCase,

    @Inject(MemberRepoSymbol)
    private readonly getMemberByIdUseCase: IGetMemberByIdUseCase,
  ) {}

  async execute(gatheringId: number, memberId: number): Promise<void> {
    const [gathering, member] = await Promise.all([
      this.getGatheringByIdUseCase.execute(gatheringId),
      this.getMemberByIdUseCase.execute(memberId),
    ]);

    const invitation = gathering.sendInviation(gathering, member);

    await this.invitationRepo.create(invitation);
  }
}
