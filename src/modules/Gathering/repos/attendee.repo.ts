import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IAttendeeRepo } from '../utils/types/Attendee';
import { AttendeeMapper } from '../mappers/Attendee';
import { Attendee } from '../domain/Attendee';

@Injectable()
export class AttendeeRepo implements IAttendeeRepo {
  constructor(private prisma: PrismaService) {}

  async create(attendee: Attendee): Promise<Attendee> {
    const createdAttendee = await this.prisma.attendee.create({
      data: {
        Gathering: { connect: { Id: attendee.GatheringId.getValue().toValue() as number } },
        Member: { connect: { Id: attendee.MemberId.getValue().toValue() as number } },
        CreatedOnUtc: attendee.creationTime,
      },
    });

    return AttendeeMapper.toDomain(createdAttendee);
  }
}
