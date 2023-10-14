import { ICommon } from 'src/utils/types';
import { Invitation } from '../Core/entity';

export interface IInvitationService {
  createGatheringInvitation(invitation: Invitation): Promise<Invitation>;
}

export interface IInvitationRepo {
  create(invitation: Invitation): Promise<any>;
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
