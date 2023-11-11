import { ICommon } from 'src/utils/types';
import { Attendee } from '../../domain/entities/Attendee';

export interface IAttendee extends Partial<ICommon> {
  MemberId: number;
  GatheringId: number;
  CreatedOnUtc: Date;
}

export interface IAttendeeRepo {
  create(attendee: Attendee): Promise<Attendee>;
}
