import { ICommon } from 'src/utils/types';

export interface IInvitationService {
  create(data: IInvitation): Promise<any>;
}

export interface IInvitationRepo {
  create(data: IInvitation): Promise<any>;
}

export interface IInvitation extends ICommon {
  memberId: number;
  invitationStatusId: number;
  gatheringId: number;
}
