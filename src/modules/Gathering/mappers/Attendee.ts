import { Attendee } from '../domain/entities/Attendee';
import { IAttendee } from '../utils/types/Attendee';

export class AttendeeMapper {
  public static toDomain(raw: IAttendee): Attendee {
    return Attendee.create(
      {
        GatheringId: raw.GatheringId,
        MemberId: raw.MemberId,
        CreatedOnUtc: raw.CreatedOnUtc,
      },
      raw?.Id,
    );
  }

  public static toPersistance() {}
  public static toDTO() {}
}
