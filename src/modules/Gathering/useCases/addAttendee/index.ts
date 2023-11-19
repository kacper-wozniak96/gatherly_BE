import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { IAddAttendeeUseCase } from './types';
import { IAttendeeRepo } from '../../utils/types/Attendee';
import { AttendeeRepoSymbol } from '../../utils/Symbols/Attendee';
import { Attendee } from '../../domain/Attendee';

@Injectable()
export class AddAttendeeUseCase implements IAddAttendeeUseCase {
  constructor(
    @Inject(AttendeeRepoSymbol)
    private readonly attendeeRepo: IAttendeeRepo,
  ) {}

  async execute(attendee: Attendee): Promise<Attendee> {
    return await this.attendeeRepo.create(attendee);
  }
}
