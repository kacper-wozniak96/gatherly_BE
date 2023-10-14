import { ForbiddenException } from '@nestjs/common/exceptions/';
import {
  EGatheringType,
  IGathering,
  // IGatheringCreationDTO,
} from '../utils/types';
import { addHours } from 'date-fns';
import { Entity } from 'src/utils/baseEntity';
import { Member } from 'src/AppModule/Member/core/entity';
import { Invitation } from 'src/AppModule/Invitation/Core/entity';

export class Gathering extends Entity<IGathering> {
  private constructor(props: IGathering, id?: number) {
    super(props, id);
  }

  public static create(
    props: IGathering,
    id?: number,
    maxiumNumberOfAttendess?: number,
    invitationsValidBeforeInHours?: number,
  ): Gathering {
    const gathering = new Gathering(props, id);

    gathering.addTypeSpecificField(
      maxiumNumberOfAttendess,
      invitationsValidBeforeInHours,
    );

    return gathering;
  }

  private addTypeSpecificField(
    maxiumNumberOfAttendess?: number,
    invitationsValidBeforeInHours?: number,
  ) {
    switch (this.props.Type) {
      case EGatheringType.WithFixedNumberofAttendees:
        if (!maxiumNumberOfAttendess)
          throw new ForbiddenException(
            'maxiumNumberOfAttendess can not be null when gathering type is set to WithFixedNumberofAttendees',
          );
        this.props.MaxiumNumberOfAttendess = maxiumNumberOfAttendess;
        break;
      case EGatheringType.WithExpirationForInvitations:
        if (!invitationsValidBeforeInHours)
          throw new ForbiddenException(
            'invitationsValidBeforeInHours can not be null when gathering type is set to WithExpirationForInvitations',
          );
        this.props.InvitationsExpireAtUtc = addHours(
          this.props.ScheduledAt,
          invitationsValidBeforeInHours,
        );
        break;
      default:
        throw new ForbiddenException(
          'Cant create gathering. Missing maxiumNumberOfAttendes and maxiumNumberOfAttendess',
        );
    }
  }

  addInviation(gathering: Gathering, member: Member) {
    if (!member || !gathering) {
      throw new ForbiddenException('Member and/or gathering does not exist');
    }

    if (gathering.CreatorId === member.Id) {
      throw new ForbiddenException(
        'Cant send invitation to the gathering creator',
      );
    }

    if (new Date(gathering.ScheduledAt) < new Date()) {
      throw new ForbiddenException(
        'Cant send invitation for gathering in the past',
      );
    }

    const invitation = Invitation.create(gathering.Id, member.Id);

    this.props.Invitations = [...(this.props.Invitations ?? []), invitation];

    return invitation;
  }

  get Id() {
    return this.props.Id;
  }

  get Name() {
    return this.props.Name;
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
}
