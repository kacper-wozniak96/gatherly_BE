import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IGatheringRepo } from '../utils/types/Gathering';
import { GatheringMapper } from '../mappers/Gathering';
import { Gathering } from '../domain/Gathering';
import { GatheringId } from '../domain/gatheringId';

@Injectable()
export class GatheringRepo implements IGatheringRepo {
  constructor(private prisma: PrismaService) {}

  async create(gathering: Gathering): Promise<Gathering> {
    const createdGathering = await this.prisma.gathering.create({
      data: {
        Name: gathering.Name,
        Location: gathering.Location,
        GatheringType: { connect: { Id: gathering.Type } },
        Creator: { connect: { Id: gathering.CreatorId } },
        ScheduledAt: new Date(gathering.ScheduledAt),
        InvitationsExpireAtUtc: gathering?.InvitationsExpireAtUtc,
        MaxiumNumberOfAttendess: gathering?.MaxiumNumberOfAttendess,
      },
    });

    return GatheringMapper.toDomain(createdGathering);
  }

  async getGatheringById(gatheringId: GatheringId): Promise<Gathering> {
    const gathering = await this.prisma.gathering.findUnique({
      where: { Id: gatheringId.getValue().toValue() as number },
    });

    return GatheringMapper.toDomain(gathering);
  }
}
