import { Attendee } from '../../domain/Attendee';

export interface IAttendeeRepo {
  create(attendee: Attendee): Promise<Attendee>;
}
