import { Inject, Injectable } from '@nestjs/common';
import { IInvitationSenderService } from './utils/types';
import { IInvitation, IInvitationService } from '../Invitation/utils/types';
import { InvitationServiceSymbol } from '../Invitation/utils/symbols';

@Injectable()
export class InvitationSenderService implements IInvitationSenderService {
  constructor(
    @Inject(InvitationServiceSymbol)
    private readonly invitationService: IInvitationService,
  ) {}

  async send(data: IInvitation): Promise<void> {
    await this.invitationService.create(data);
  }
}
