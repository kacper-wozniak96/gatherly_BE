import { ICommon } from 'src/utils/types';
import { Gathering } from '../../domain/Gathering';
import { IGatheringCreationDTO } from '../../useCases/createGathering/types';
import { GatheringId } from '../../domain/gatheringId';

// export interface IGatheringCreationDTO {
//   CreatorId: number;
//   Type: number;
//   ScheduledAt: Date;
//   Name: string;
//   Location: string;
//   MaxiumNumberOfAttendess?: number;
//   InvitationsValidBeforeInHours?: number;
// }

export type IGatheringUpdateDTO = Partial<IGatheringCreationDTO> & ICommon;

export interface IGatheringController {
  create(gatheringCreationDTO: IGatheringCreationDTO): Promise<any>;
}

export interface IGatheringRepo {
  create(gathering: Gathering): Promise<Gathering>;
  getGatheringById(gatheringId: GatheringId): Promise<Gathering>;
}

export enum EGatheringType {
  WithFixedNumberofAttendees,
  WithExpirationForInvitations,
}
