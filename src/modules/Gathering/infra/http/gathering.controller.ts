import { Controller, Post, Body, Inject } from '@nestjs/common';
import { IGatheringController } from '../../utils/types/Gathering';
import { CreateGatheringUseCaseSymbol } from '../../utils/Symbols/Gathering';
import { ICreateGatheringUseCase, IGatheringCreationDTO } from '../../useCases/createGathering/types';

@Controller('Gathering')
export class GatheringController implements IGatheringController {
  constructor(
    @Inject(CreateGatheringUseCaseSymbol)
    private readonly createGatheringUseCase: ICreateGatheringUseCase,
  ) {}

  @Post()
  async create(@Body() gatheringCreationDTO: IGatheringCreationDTO): Promise<any> {
    return await this.createGatheringUseCase.execute(gatheringCreationDTO);
  }
}
