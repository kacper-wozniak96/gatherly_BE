import { Inject } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { IGathering, IGatheringService } from './Core/types';
import { GatheringRepo } from './gathering.repo';
import { IGatheringRepoSymbol } from './Core/symbols';
import { Gathering } from './Core/entity';

@Injectable()
export class GatheringService implements IGatheringService {
  constructor(
    @Inject(IGatheringRepoSymbol) private readonly gatheringRepo: GatheringRepo,
  ) {}

  async create(data: IGathering): Promise<any> {
    const gathering = Gathering.create(data);

    return this.gatheringRepo.create(gathering);
  }
}
