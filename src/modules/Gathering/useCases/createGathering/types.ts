import { Gathering } from '../../domain/entities/Gathering';

export interface ICreateGatheringUseCase {
  execute(gatheringData: IGatheringCreationDTO): Promise<Gathering>;
}

export interface IGatheringCreationDTO {
  CreatorId: number;
  Type: number;
  ScheduledAt: Date;
  Name: string;
  Location: string;
  MaxiumNumberOfAttendess?: number;
  InvitationsValidBeforeInHours?: number;
}
