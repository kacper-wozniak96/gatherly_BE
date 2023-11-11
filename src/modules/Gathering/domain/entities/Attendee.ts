import { Entity } from 'src/utils/baseEntity';
import { IAttendee } from '../../utils/types/Attendee';

export class Attendee extends Entity<IAttendee> {
  constructor(props: IAttendee, id?: number) {
    super(props, id);
  }

  // public static create(props: IInvitation, id?: number): Attendee {
  public static create(props: IAttendee, id?: number): Attendee {
    return new Attendee(
      {
        GatheringId: props.GatheringId,
        MemberId: props.MemberId,
        CreatedOnUtc: new Date(),
      },
      id,
    );
  }

  get GatheringId() {
    return this.props.GatheringId;
  }

  get MemberId() {
    return this.props.MemberId;
  }

  get creationTime() {
    return this.props.CreatedOnUtc;
  }
}
