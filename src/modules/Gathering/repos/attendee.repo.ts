import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IAttendeeRepo } from '../utils/types/Attendee';
import { Attendee } from '../domain/entities/Attendee';
import { AttendeeMapper } from '../mappers/Attendee';

@Injectable()
export class AttendeeRepo implements IAttendeeRepo {
  constructor(private prisma: PrismaService) {}

  async create(attendee: Attendee): Promise<Attendee> {
    const createdAttendee = await this.prisma.attendee.create({
      data: {
        Gathering: { connect: { Id: attendee.GatheringId } },
        Member: { connect: { Id: attendee.MemberId } },
        CreatedOnUtc: attendee.creationTime,
      },
    });

    return AttendeeMapper.toDomain(createdAttendee);
  }
}
