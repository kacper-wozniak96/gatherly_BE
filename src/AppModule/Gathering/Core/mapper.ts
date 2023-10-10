import {
  IGathering,
  IGatheringCreationDTO,
  IGatheringUpdateDTO,
} from './types';

export class GatheringMapper {
  public static toDomain(
    gatheringDTO: IGatheringCreationDTO | IGatheringUpdateDTO,
  ): IGathering {
    return {
      id: (gatheringDTO as IGatheringUpdateDTO)?.id,
      CreatorId: gatheringDTO?.CreatorId,
      Location: gatheringDTO?.Location,
      Name: gatheringDTO?.Name,
      ScheduledAt: gatheringDTO?.ScheduledAt,
      Type: gatheringDTO?.Type,
    };
  }
}
