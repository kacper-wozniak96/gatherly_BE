import { Attendee } from '../../domain/entities/Attendee';

export interface IAddAttendeeUseCase {
  execute(attendee: Attendee): Promise<Attendee>;
}
