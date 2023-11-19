import { Entity } from 'src/shared/core/Entity';
import { EInvitationStatus } from '../utils/types/Invitation';
import { Attendee } from './Attendee';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { MemberId } from 'src/modules/Member/domain/memberId';
import { GatheringId } from './gatheringId';

export interface InvitationProps {
  MemberId: MemberId;
  InvitationStatusId: number;
  GatheringId: GatheringId;
  CreatedOnUtc: Date;
  ModifiedOnUtc?: Date;
}

export class Invitation extends Entity<InvitationProps> {
  private constructor(props: InvitationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: InvitationProps, id?: UniqueEntityID): Invitation {
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
