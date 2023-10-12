import { IInvitation } from 'src/AppModule/Invitation/utils/types';

export interface IInvitationSenderService {
  send(data: IInvitation): void;
}
