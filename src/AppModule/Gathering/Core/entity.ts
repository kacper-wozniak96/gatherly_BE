import { ForbiddenException } from '@nestjs/common/exceptions/';
import { EGatheringType, IGathering } from './types';
import { addHours } from 'date-fns';

export class Gathering implements IGathering {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  id?: number;
  MaxiumNumberOfAttendess?: number;
  InvitationsExpireAtUtc?: Date;

  private constructor(gathering: IGathering) {
    this.id = gathering?.id;
    this.CreatorId = gathering.CreatorId;
    this.Location = gathering.Location;
    this.Name = gathering.Name;
    this.ScheduledAt = gathering.ScheduledAt;
    this.Type = gathering.Type;
  }

  public static create(
    data: IGathering,
    maxiumNumberOfAttendess?: number,
    invitationsValidBeforeInHours?: number,
  ): IGathering {
    const gathering = new Gathering(data);

    switch (gathering.Type) {
      case EGatheringType.WithFixedNumberofAttendees:
        if (!maxiumNumberOfAttendess)
          throw new ForbiddenException(
            'maxiumNumberOfAttendess can not be null when gathering type is set to WithFixedNumberofAttendees',
          );
        gathering.MaxiumNumberOfAttendess = maxiumNumberOfAttendess;
        break;
      case EGatheringType.WithExpirationForInvitations:
        if (!invitationsValidBeforeInHours)
          throw new ForbiddenException(
            'invitationsValidBeforeInHours can not be null when gathering type is set to WithExpirationForInvitations',
          );
        gathering.InvitationsExpireAtUtc = addHours(
          gathering.ScheduledAt,
          invitationsValidBeforeInHours,
        );
        break;
      default:
        throw new ForbiddenException(
          'Cant create gathering. Missing maxiumNumberOfAttendes and maxiumNumberOfAttendess',
        );
    }

    return gathering;
  }
}
