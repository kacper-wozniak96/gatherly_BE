import { Entity } from 'src/shared/core/Entity';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { MemberId } from 'src/modules/Member/domain/memberId';
import { GatheringId } from './gatheringId';

export interface AttendeeProps {
  MemberId: MemberId;
  GatheringId: GatheringId;
  CreatedOnUtc: Date;
}

export class Attendee extends Entity<AttendeeProps> {
  constructor(props: AttendeeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  // public static create(props: InvitationProps, id?: number): Attendee {
  public static create(props: AttendeeProps, id?: UniqueEntityID): Attendee {
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
