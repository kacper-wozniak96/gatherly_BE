import { Inject, Injectable } from '@nestjs/common';
import {
  IInvitation,
  IInvitationRepo,
  IInvitationService,
} from './utils/types';
import { InvitationRepoSymbol } from './utils/symbols';

@Injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @Inject(InvitationRepoSymbol)
    private readonly invitationRepo: IInvitationRepo,
  ) {}

  async createGatheringInvitation(data: IInvitation): Promise<any> {
    await this.invitationRepo.create(data);
  }
}
