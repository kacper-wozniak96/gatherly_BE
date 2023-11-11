import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { Gathering } from '../../domain/entities/Gathering';
import { GatheringRepoSymbol } from '../../utils/Symbols/Gathering';
import { IGatheringRepo } from '../../utils/types/Gathering';
import { IGetGatheringByIdUseCase } from './types';

@Injectable()
export class GetGatheringByIdUseCase implements IGetGatheringByIdUseCase {
  constructor(
    @Inject(GatheringRepoSymbol)
    private readonly gatheringRepo: IGatheringRepo,
  ) {}

  async execute(gatheringId: number): Promise<Gathering> {
    return await this.gatheringRepo.getGatheringById(gatheringId);
  }
}
