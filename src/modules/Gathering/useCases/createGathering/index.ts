import { ForbiddenException, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { Gathering } from '../../domain/entities/Gathering';
import { GatheringRepoSymbol } from '../../utils/Symbols/Gathering';
import { IGatheringRepo } from '../../utils/types/Gathering';
import { ICreateGatheringUseCase, IGatheringCreationDTO } from './types';
import { GetMemberByIdUseCase } from 'src/AppModule/Member/use-cases/getMemberById';
import { GetMemberByIdUseCaseSymbol } from 'src/AppModule/Member/utils/symbols';

@Injectable()
export class CreateGatheringUseCase implements ICreateGatheringUseCase {
  constructor(
    @Inject(GatheringRepoSymbol)
    private readonly gatheringRepo: IGatheringRepo,

    @Inject(GetMemberByIdUseCaseSymbol)
    private readonly getMemberByIdUseCase: GetMemberByIdUseCase,
  ) {}

  async execute(
    gatheringCreationDTO: IGatheringCreationDTO,
  ): Promise<Gathering> {
    const creator = await this.getMemberByIdUseCase.execute(
      gatheringCreationDTO?.CreatorId,
    );

    if (!creator) throw new ForbiddenException('Creator not found');

    const gathering = Gathering.create(
      gatheringCreationDTO,
      undefined,
      gatheringCreationDTO?.MaxiumNumberOfAttendess,
      gatheringCreationDTO?.InvitationsValidBeforeInHours,
    );

    return await this.gatheringRepo.create(gathering);
  }
}
