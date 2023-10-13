import { Gathering } from '../Core/entity';

export class GatheringMapper {
  public static toDomain(raw: any): Gathering {
    return Gathering.create(
      {
        Name: raw.Name,
        Location: raw.Location,
        CreatorId: raw.CreatorId,
        ScheduledAt: raw.ScheduledAt,
        Type: raw.Type,
        MaxiumNumberOfAttendess: raw?.MaxiumNumberOfAttendess,
        InvitationsExpireAtUtc: raw?.InvitationsExpireAtUtc,
      },
      raw?.Id,
    );
  }

  public static toPersistance() {}
}
