import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { Gathering } from '../../domain/Gathering';
import { GatheringRepoSymbol } from '../../utils/Symbols/Gathering';
import { IGatheringRepo } from '../../utils/types/Gathering';
import { IGetGatheringByIdUseCase } from './types';
import { GatheringId } from '../../domain/gatheringId';

@Injectable()
export class GetGatheringByIdUseCase implements IGetGatheringByIdUseCase {
  constructor(
    @Inject(GatheringRepoSymbol)
    private readonly gatheringRepo: IGatheringRepo,
  ) {}

  async execute(gatheringId: GatheringId): Promise<Gathering> {
    return await this.gatheringRepo.getGatheringById(gatheringId);
  }
}
