import { Inject, Injectable } from '@nestjs/common';
import { IInvitationRepo, IInvitationService } from './utils/types';
import { InvitationRepoSymbol } from './utils/symbols';
import { Invitation } from './Core/entity';

@Injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @Inject(InvitationRepoSymbol)
    private readonly invitationRepo: IInvitationRepo,
  ) {}

  async createGatheringInvitation(invitation: Invitation): Promise<any> {
    await this.invitationRepo.create(invitation);
  }
}
