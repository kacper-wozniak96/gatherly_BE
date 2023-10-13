import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import {
  IGatheringController,
  IGatheringCreationDTO,
  IGatheringService,
} from './utils/types';
import { GatheringServiceSymbol } from './utils/symbols';

@Controller('Gathering')
export class GatheringController implements IGatheringController {
  constructor(
    @Inject(GatheringServiceSymbol)
    private readonly gatheringService: IGatheringService,
  ) {}

  @Post()
  async create(
    @Body() gatheringCreationDTO: IGatheringCreationDTO,
  ): Promise<any> {
    return await this.gatheringService.create(gatheringCreationDTO);
  }

  @Get()
  async get(): Promise<any> {
    return 'heja';
  }
}
