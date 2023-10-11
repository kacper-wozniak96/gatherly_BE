import { ICommon } from 'src/utils/types';

export interface IGatheringCreationDTO {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  maxiumNumberOfAttendess?: number;
  invitationsValidBeforeInHours?: number;
}

export type IGatheringUpdateDTO = Partial<IGatheringCreationDTO> & ICommon;

export interface IGathering extends Partial<ICommon> {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
}

export interface IGatheringController {
  create(gatheringCreationDTO: IGatheringCreationDTO): Promise<any>;
}

export interface IGatheringService {
  create(gathering: IGathering): Promise<any>;
}

export interface IGatheringRepo {
  create(gathering: IGathering): Promise<any>;
}

export enum EGatheringType {
  WithFixedNumberofAttendees,
  WithExpirationForInvitations,
}
