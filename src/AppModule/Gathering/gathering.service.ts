import { ForbiddenException, Inject } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { IGathering, IGatheringRepo, IGatheringService } from './utils/types';
import { GatheringRepoSymbol } from './utils/symbols';
import { Gathering } from './Core/entity';
import { MemberServiceSymbol } from '../Member/utils/symbols';
import { IMemberService } from '../Member/utils/types';

@Injectable()
export class GatheringService implements IGatheringService {
  constructor(
    @Inject(GatheringRepoSymbol)
    private readonly gatheringRepo: IGatheringRepo,

    @Inject(MemberServiceSymbol)
    private readonly memeberSerive: IMemberService,
  ) {}

  async create(
    gatheringData: IGathering,
    maxiumNumberOfAttendess?: number,
    invitationsValidBeforeInHours?: number,
  ): Promise<any> {
    const creator = await this.memeberSerive.getById(gatheringData?.CreatorId);

    if (!creator) throw new ForbiddenException('Creator not found');

    const gathering = Gathering.create(
      gatheringData,
      maxiumNumberOfAttendess,
      invitationsValidBeforeInHours,
    );

    return await this.gatheringRepo.create(gathering);
  }
}
