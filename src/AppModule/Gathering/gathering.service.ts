import { Injectable } from '@nestjs/common';
import { IGathering } from './Core/types';
import { GatheringRepo } from './gathering.repo';

@Injectable()
export class GatheringService {
  constructor(private readonly gatheringRepo: GatheringRepo) {}

  async create(gathering: IGathering): Promise<any> {
    return this.gatheringRepo.create(gathering);
  }
}
