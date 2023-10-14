import { ForbiddenException } from '@nestjs/common/exceptions/';
import {
  EGatheringType,
  IGathering,
  // IGatheringCreationDTO,
} from '../utils/types';
import { addHours } from 'date-fns';
import { Entity } from 'src/utils/baseEntity';

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
