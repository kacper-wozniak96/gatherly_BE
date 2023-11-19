import { Gathering } from '../../domain/Gathering';
import { GatheringId } from '../../domain/gatheringId';

export interface IGetGatheringByIdUseCase {
  execute(gatheringId: GatheringId): Promise<Gathering>;
}
