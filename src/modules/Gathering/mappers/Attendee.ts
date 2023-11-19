import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Attendee } from '../domain/Attendee';

export class AttendeeMapper {
  public static toDomain(raw: any): Attendee {
    return Attendee.create(
      {
        GatheringId: raw.GatheringId,
        MemberId: raw.MemberId,
        CreatedOnUtc: raw.CreatedOnUtc,
      },
      new UniqueEntityID(raw?.Id),
    );
  }

  public static toPersistance() {}
  public static toDTO() {}
}
