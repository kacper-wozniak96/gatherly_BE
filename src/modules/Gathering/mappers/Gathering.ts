import { Gathering } from '../domain/entities/Gathering';
import { IGathering } from '../utils/types/Gathering';

export class GatheringMapper {
  public static toDomain(raw: IGathering): Gathering {
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
  public static toDTO() {}
}
