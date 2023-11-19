import { ICommon } from 'src/utils/types';
import { Invitation } from '../../domain/Invitation';
import { MemberId } from 'src/modules/Member/domain/memberId';
import { GatheringId } from '../../domain/gatheringId';

export interface InvitationPropsService {
  createGatheringInvitation(invitation: Invitation): Promise<Invitation>;
}

export interface InvitationPropsRepo {
  create(invitation: Invitation): Promise<Invitation>;
  getById(invitationId: number): Promise<Invitation>;
}

export interface InvitationProps extends Partial<ICommon> {
  MemberId: MemberId;
  InvitationStatusId: number;
  GatheringId: GatheringId;
  CreatedOnUtc: Date;
  ModifiedOnUtc?: Date;
}

export enum EInvitationStatus {
  Pending,
  Expired,
  Accepted,
}
