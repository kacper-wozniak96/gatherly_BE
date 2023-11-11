import { ICommon } from 'src/utils/types';
import { Gathering } from '../../domain/entities/Gathering';
import { Invitation } from 'src/AppModule/Invitation/Core/entity';
import { IGatheringCreationDTO } from '../use-cases/createGathering/types';
import { Attendee } from 'src/AppModule/Attendee/Core/entity';

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

export interface IGathering extends Partial<ICommon> {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  NumberOfAttendees?: number;
  MaxiumNumberOfAttendess?: number;
  InvitationsExpireAtUtc?: Date;

  Attendees?: Attendee[];
  Invitations?: Invitation[];
}

export interface IGatheringController {
  create(gatheringCreationDTO: IGatheringCreationDTO): Promise<any>;
}

export interface IGatheringService {
  getGatheringById(gatheringId: number): Promise<IGathering>;
  create(gathering: IGathering): Promise<any>;
  inviteToGathering(gatheringId: number, memberIdToInvite: number): Promise<any>;
}

export interface IGatheringRepo {
  create(gathering: Gathering): Promise<Gathering>;
  getGatheringById(gatheringId: number): Promise<Gathering>;
}

export enum EGatheringType {
  WithFixedNumberofAttendees,
  WithExpirationForInvitations,
}
