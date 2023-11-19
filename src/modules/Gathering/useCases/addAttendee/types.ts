import { Attendee } from '../../domain/Attendee';

export interface IAddAttendeeUseCase {
  execute(attendee: Attendee): Promise<Attendee>;
}
