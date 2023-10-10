import { Inject } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { IGathering, IGatheringService } from './Core/types';
import { GatheringRepo } from './gathering.repo';
import { IGatheringRepoSymbol } from './Core/symbols';

@Injectable()
export class GatheringService implements IGatheringService {
  constructor(
    @Inject(IGatheringRepoSymbol) private readonly gatheringRepo: GatheringRepo,
  ) {}

  async create(gathering: IGathering): Promise<any> {
    return this.gatheringRepo.create(gathering);
  }
}
