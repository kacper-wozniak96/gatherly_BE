import { ICommon } from 'src/utils/types';

export interface IInvitationService {
  createGatheringInvitation(data: IInvitation): Promise<any>;
}

export interface IInvitationRepo {
  create(data: IInvitation): Promise<any>;
}

export interface IInvitation extends Partial<ICommon> {
  memberId: number;
  invitationStatusId: number;
  gatheringId: number;
  createdOnUtc: Date;
}

export enum EInvitationStatus {
  Pending,
}
