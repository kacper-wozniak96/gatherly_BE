import { ForbiddenException, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { Gathering } from '../../domain/Gathering';
import { GatheringRepoSymbol } from '../../utils/Symbols/Gathering';
import { IGatheringRepo } from '../../utils/types/Gathering';
import { ICreateGatheringUseCase, IGatheringCreationDTO } from './types';
import { GetMemberByIdUseCaseSymbol } from 'src/modules/Member/utils/symbols';
import { GetMemberByIdUseCase } from 'src/modules/Member/use-cases/getMemberById';
import { CreatorId } from '../../domain/CreatorId';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

@Injectable()
export class CreateGatheringUseCase implements ICreateGatheringUseCase {
  constructor(
    @Inject(GatheringRepoSymbol)
    private readonly gatheringRepo: IGatheringRepo,

    @Inject(GetMemberByIdUseCaseSymbol)
    private readonly getMemberByIdUseCase: GetMemberByIdUseCase,
  ) {}

  async execute(gatheringCreationDTO: IGatheringCreationDTO): Promise<Gathering> {
    const creatorIdOrError = CreatorId.create(new UniqueEntityID(gatheringCreationDTO?.CreatorId));

    const creatorId = creatorIdOrError.getSuccessValue();

    const creator = await this.getMemberByIdUseCase.execute(creatorId);

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
