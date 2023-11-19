import { ForbiddenException, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { InvitationRepoSymbol } from '../../utils/Symbols/Invitation';
import { EInvitationStatus, InvitationPropsRepo } from '../../utils/types/Invitation';
import { IAcceptInvitationUseCase } from './types';
import { GetGatheringByIdUseCaseSymbol } from '../../utils/Symbols/Gathering';
import { IGetGatheringByIdUseCase } from '../getGatheringById/types';
import { GetMemberByIdUseCaseSymbol } from 'src/modules/Member/utils/symbols';
import { IGetMemberByIdUseCase } from 'src/modules/Member/use-cases/getMemberById/types';
import { AddAttendeeUseCaseSymbol } from '../../utils/Symbols/Attendee';
import { IAddAttendeeUseCase } from '../addAttendee/types';

@Injectable()
export class AcceptInvitationUseCase implements IAcceptInvitationUseCase {
  constructor(
    @Inject(InvitationRepoSymbol)
    private readonly invitationRepo: InvitationPropsRepo,

    @Inject(GetGatheringByIdUseCaseSymbol)
    private readonly getGatheringByIdUseCase: IGetGatheringByIdUseCase,

    @Inject(GetMemberByIdUseCaseSymbol)
    private readonly getMemberByIdUseCase: IGetMemberByIdUseCase,

    @Inject(AddAttendeeUseCaseSymbol)
    private readonly addAttendeeUseCase: IAddAttendeeUseCase,
  ) {}

  async execute(invitationId: number): Promise<void> {
    const invitation = await this.invitationRepo.getById(invitationId);
    if (!invitation) throw new ForbiddenException('Invitation does not exist');
    if (invitation.InvitationStatusId !== EInvitationStatus.Pending) {
      throw new ForbiddenException('Cant accept. Invitation is not in pending state');
    }

    // if (
    //   !invitation &&
    //   invitation.InvitationStatusId !== EInvitationStatus.Pending
    // ) {
    //   throw new ForbiddenException('Cant accept');
    // }

    const [gathering, member] = await Promise.all([
      this.getGatheringByIdUseCase.execute(invitation.GatheringId),
      this.getMemberByIdUseCase.execute(invitation.MemberId),
    ]);

    if (!gathering || !member) {
      throw new ForbiddenException('Cant accept');
    }

    const attendee = gathering.acceptInvitation(invitation);

    if (attendee) await this.addAttendeeUseCase.execute(attendee);

    if ((invitation.InvitationStatusId as EInvitationStatus.Accepted | EInvitationStatus.Expired) === EInvitationStatus.Accepted) {
      console.log('wyslij email');
    }
  }
}
