import { ForbiddenException } from '@nestjs/common/exceptions/';
import { EGatheringType } from '../utils/types/Gathering';
import { addHours } from 'date-fns';
import { Member } from 'src/modules/Member/domain/member';
import { Invitation } from './Invitation';
import { EInvitationStatus } from '../utils/types/Invitation';
import { Attendee } from './Attendee';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { AggregateRoot } from 'src/shared/core/AggregateRoot';
import { GatheringId } from './gatheringId';

export interface GatheringProps {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  NumberOfAttendees?: number;
  MaxiumNumberOfAttendess?: number;
  InvitationsExpireAtUtc?: Date;

  Attendees?: Attendee[];
  Invitations?: Invitation[];
}

export class Gathering extends AggregateRoot<GatheringProps> {
  private constructor(props: GatheringProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: GatheringProps,
    id?: UniqueEntityID,
    maxiumNumberOfAttendess?: number,
    invitationsValidBeforeInHours?: number,
  ): Gathering {
    const gathering = new Gathering(props, id);

    gathering.addTypeSpecificField(maxiumNumberOfAttendess, invitationsValidBeforeInHours);

    return gathering;
  }

  private addTypeSpecificField(maxiumNumberOfAttendess?: number, invitationsValidBeforeInHours?: number) {
    switch (this.props.Type) {
      case EGatheringType.WithFixedNumberofAttendees:
        if (!maxiumNumberOfAttendess)
          throw new ForbiddenException('maxiumNumberOfAttendess can not be null when gathering type is set to WithFixedNumberofAttendees');
        this.props.MaxiumNumberOfAttendess = maxiumNumberOfAttendess;
        break;
      case EGatheringType.WithExpirationForInvitations:
        if (!invitationsValidBeforeInHours)
          throw new ForbiddenException(
            'invitationsValidBeforeInHours can not be null when gathering type is set to WithExpirationForInvitations',
          );
        this.props.InvitationsExpireAtUtc = addHours(this.props.ScheduledAt, invitationsValidBeforeInHours);
        break;
      default:
        throw new ForbiddenException('Cant create gathering. Missing maxiumNumberOfAttendes and maxiumNumberOfAttendess');
    }
  }

  sendInviation(gathering: Gathering, member: Member) {
    if (!member || !gathering) {
      throw new ForbiddenException('Member and/or gathering does not exist');
    }

    if (gathering.CreatorId === member.memberId.getValue().toValue()) {
      throw new ForbiddenException('Cant send invitation to the gathering creator');
    }

    if (new Date(gathering.ScheduledAt) < new Date()) {
      throw new ForbiddenException('Cant send invitation for gathering in the past');
    }

    const invitation = Invitation.create({
      GatheringId: GatheringId.create(gathering.gatheringId.getValue()).getSuccessValue(),
      MemberId: member?.memberId,
      CreatedOnUtc: new Date(),
      InvitationStatusId: EInvitationStatus.Pending,
    });

    this.props.Invitations = [...(this.props.Invitations ?? []), invitation];

    return invitation;
  }

  acceptInvitation(invitation: Invitation): Attendee {
    // invitation.InvitationStatusId = EInvitationStatus.Accepted;

    const isExpired =
      (this.Type === EGatheringType.WithFixedNumberofAttendees && this.NumberOfAttendees === this.MaxiumNumberOfAttendess) ||
      (this.Type === EGatheringType.WithExpirationForInvitations && new Date(this.InvitationsExpireAtUtc) < new Date());

    if (isExpired) {
      invitation.expire();
      throw new Error('Invitation has expired');
    }

    const attendee = invitation.accept();

    this.props.Attendees = [...(this.props.Attendees ?? []), attendee];
    this.props.NumberOfAttendees++;

    return attendee;
  }

  get gatheringId() {
    return GatheringId.create(this._id).getSuccessValue();
  }

  get Name() {
    return this.props.Name;
  }

  get NumberOfAttendees() {
    return this.props.NumberOfAttendees;
  }

  get CreatorId() {
    return this.props.CreatorId;
  }

  get Location() {
    return this.props.Location;
  }

  get MaxiumNumberOfAttendess() {
    return this.props.MaxiumNumberOfAttendess;
  }

  get InvitationsExpireAtUtc() {
    return this.props.InvitationsExpireAtUtc;
  }

  get ScheduledAt() {
    return this.props.ScheduledAt;
  }

  get Type() {
    return this.props.Type;
  }

  get Attendees() {
    return this.props.Attendees;
  }
}
