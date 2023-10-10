import { Controller, Post, Body } from '@nestjs/common';
import { IGatheringCreationDTO } from './Core/types';
import { GatheringMapper } from './Core/mapper';
import { GatheringService } from './gathering.service';

@Controller('Gathering')
export class GatheringController {
  constructor(private readonly gatheringService: GatheringService) {}

  @Post()
  async create(
    @Body() gatheringCreationDTO: IGatheringCreationDTO,
  ): Promise<any> {
    console.log({ gatheringCreationDTO });

    return await this.gatheringService.create(
      GatheringMapper.toDomain(gatheringCreationDTO),
    );
  }
}
