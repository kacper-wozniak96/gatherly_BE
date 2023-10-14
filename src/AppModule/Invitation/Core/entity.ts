import { Entity } from 'src/utils/baseEntity';
import { EInvitationStatus, IInvitation } from '../utils/types';

export class Invitation extends Entity<IInvitation> {
  private constructor(props: IInvitation, id?: number) {
    super(props, id);
  }

  public static create(gatheringId: number, memberId: number): Invitation {
    return new Invitation({
      gatheringId: gatheringId,
      memberId: memberId,
      invitationStatusId: EInvitationStatus.Pending,
      createdOnUtc: new Date(),
    });
  }

  get gatheringId() {
    return this.props.gatheringId;
  }

  get memberId() {
    return this.props.memberId;
  }

  get invitationStatusId() {
    return this.props.invitationStatusId;
  }
}
