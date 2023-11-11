import { Gathering } from '../../domain/entities/Gathering';

export interface IGetGatheringByIdUseCase {
  execute(gatheringId: number): Promise<Gathering>;
}
