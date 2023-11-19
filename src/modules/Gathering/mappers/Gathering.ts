import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Gathering } from '../domain/Gathering';

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
      new UniqueEntityID(raw?.Id),
    );
  }

  public static toPersistance() {}
  public static toDTO() {}
}
