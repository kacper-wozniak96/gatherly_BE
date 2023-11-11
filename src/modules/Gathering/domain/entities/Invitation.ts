import { Entity } from 'src/utils/baseEntity';
import { EInvitationStatus, IInvitation } from '../../utils/types/Invitation';
import { Attendee } from './Attendee';

export class Invitation extends Entity<IInvitation> {
  private constructor(props: IInvitation, id?: number) {
    super(props, id);
  }

  public static create(props: IInvitation, id?: number): Invitation {
    return new Invitation(
      {
        GatheringId: props.GatheringId,
        MemberId: props.MemberId,
        InvitationStatusId: EInvitationStatus.Pending,
        CreatedOnUtc: new Date(),
      },
      id,
    );
  }

  expire(): void {
    this.InvitationStatusId = EInvitationStatus.Expired;
    this.ModifiedOnUtc = new Date();
  }

  accept(): Attendee {
    this.InvitationStatusId = EInvitationStatus.Accepted;
    this.ModifiedOnUtc = new Date();

    return Attendee.create({
      GatheringId: this.GatheringId,
      MemberId: this.MemberId,
      CreatedOnUtc: this.CreatedOnUtc,
    });
  }

  get GatheringId() {
    return this.props.GatheringId;
  }

  get MemberId() {
    return this.props.MemberId;
  }

  get CreatedOnUtc() {
    return this.props.CreatedOnUtc;
  }

  get InvitationStatusId() {
    return this.props.InvitationStatusId;
  }

  set InvitationStatusId(newStatusId: EInvitationStatus) {
    this.props.InvitationStatusId = newStatusId;
  }

  set ModifiedOnUtc(newDate: Date) {
    this.props.ModifiedOnUtc = newDate;
  }
}
