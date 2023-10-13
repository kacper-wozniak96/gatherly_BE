import { ICommon } from 'src/utils/types';
import { Gathering } from '../Core/entity';

export interface IGatheringCreationDTO {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  MaxiumNumberOfAttendess?: number;
  InvitationsValidBeforeInHours?: number;
}

export type IGatheringUpdateDTO = Partial<IGatheringCreationDTO> & ICommon;

export interface IGathering extends Partial<ICommon> {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  MaxiumNumberOfAttendess?: number;
  InvitationsExpireAtUtc?: Date;
}

export interface IGatheringController {
  create(gatheringCreationDTO: IGatheringCreationDTO): Promise<any>;
}

export interface IGatheringService {
  getGatheringById(gatheringId: number): Promise<IGathering>;
  create(gathering: IGathering): Promise<any>;
  inviteToGathering(
    gatheringId: number,
    memberIdToInvite: number,
  ): Promise<any>;
}

export interface IGatheringRepo {
  create(gathering: Gathering): Promise<Gathering>;
  getGatheringById(gatheringId: number): Promise<IGathering>;
}

export enum EGatheringType {
  WithFixedNumberofAttendees,
  WithExpirationForInvitations,
}
