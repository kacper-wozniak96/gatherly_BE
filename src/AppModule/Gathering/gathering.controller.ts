import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import {
  IGatheringController,
  IGatheringCreationDTO,
  IGatheringService,
} from './Core/types';
import { GatheringMapper } from './Core/mapper';
import { IGatheringServiceSymbol } from './Core/symbols';

@Controller('Gathering')
export class GatheringController implements IGatheringController {
  constructor(
    @Inject(IGatheringServiceSymbol)
    private readonly gatheringService: IGatheringService,
  ) {}

  @Post()
  async create(
    @Body() gatheringCreationDTO: IGatheringCreationDTO,
  ): Promise<any> {
    console.log({ gatheringCreationDTO });

    return await this.gatheringService.create(
      GatheringMapper.toDomain(gatheringCreationDTO),
    );
  }

  @Get()
  async get(): Promise<any> {
    return 'heja';
  }
}
