import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IGathering } from './Core/types';

@Injectable()
export class GatheringRepo {
  constructor(private prisma: PrismaService) {}

  async create(gathering: IGathering): Promise<any> {
    return this.prisma.gathering.create({
      data: {
        Name: gathering.Name,
        Location: gathering.Location,
        GatheringType: { connect: { id: gathering.Type } },
        Creator: { connect: { id: gathering.CreatorId } },
        ScheduledAt: new Date(gathering.ScheduledAt),
      },
    });
  }
}
