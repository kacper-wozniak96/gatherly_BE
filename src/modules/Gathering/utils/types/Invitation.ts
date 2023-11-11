import { ICommon } from 'src/utils/types';
import { Invitation } from '../../domain/entities/Invitation';

export interface IInvitationService {
  createGatheringInvitation(invitation: Invitation): Promise<Invitation>;
}

export interface IInvitationRepo {
  create(invitation: Invitation): Promise<Invitation>;
  getById(invitationId: number): Promise<Invitation>;
}

export interface IInvitation extends Partial<ICommon> {
  MemberId: number;
  InvitationStatusId: number;
  GatheringId: number;
  CreatedOnUtc: Date;
  ModifiedOnUtc?: Date;
}

export enum EInvitationStatus {
  Pending,
  Expired,
  Accepted,
}
