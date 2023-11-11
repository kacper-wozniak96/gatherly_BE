import { Controller, Post, Body, Inject } from '@nestjs/common';
import { IGatheringController } from '../../utils/types/Gathering';
import {
  ICreateGatheringUseCase,
  IGatheringCreationDTO,
} from './use-cases/createGathering/types';
import { CreateGatheringUseCaseSymbol } from '../../utils/Symbols/Gathering';

@Controller('Gathering')
export class GatheringController implements IGatheringController {
  constructor(
    @Inject(CreateGatheringUseCaseSymbol)
    private readonly createGatheringUseCase: ICreateGatheringUseCase,
  ) {}

  @Post()
  async create(
    @Body() gatheringCreationDTO: IGatheringCreationDTO,
  ): Promise<any> {
    return await this.createGatheringUseCase.execute(gatheringCreationDTO);
  }
}
