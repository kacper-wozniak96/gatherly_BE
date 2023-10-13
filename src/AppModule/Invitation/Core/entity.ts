import { EInvitationStatus, IInvitation } from '../utils/types';

export class Invitation implements IInvitation {
  id?: number;
  gatheringId: number;
  memberId: number;
  invitationStatusId: number;
  createdOnUtc: Date;

  constructor(invitation: IInvitation) {
    this.id = invitation?.id;
    this.gatheringId = invitation?.gatheringId;
    this.memberId = invitation?.memberId;
    this.invitationStatusId = EInvitationStatus.Pending;
    this.createdOnUtc = new Date();
  }
}
