import { EInvitationStatus, IInvitation } from '../utils/types';

export class Invitation extends IInvitation {
  id?: number;
  gatheringId: number;
  memberId: number;
  invitationStatusId: number;
  createdOnUtc: Date;

  constructor(invitation: IInvitation) {
    this.id = invitation?.Id;
    this.gatheringId = invitation?.gatheringId;
    this.memberId = invitation?.memberId;
    this.invitationStatusId = EInvitationStatus.Pending;
    this.createdOnUtc = new Date();
  }
}
