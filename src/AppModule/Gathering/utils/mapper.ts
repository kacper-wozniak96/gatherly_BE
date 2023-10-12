import {
  IGathering,
  // IGatheringCreationDTO,
  // IGatheringUpdateDTO,
} from './types';

export class GatheringMapper {
  public static toDomain(
    // gatheringDTO: IGatheringCreationDTO | IGatheringUpdateDTO,
    raw: any,
  ): IGathering {
    return {
      id: raw?.id,
      CreatorId: raw?.CreatorId,
      Location: raw?.Location,
      Name: raw?.Name,
      ScheduledAt: raw?.ScheduledAt,
      Type: raw?.Type,
    };
  }
}
