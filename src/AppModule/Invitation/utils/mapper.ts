import { IInvitation } from './types';

export class InvitationMapper {
  public static toDomain(raw: any): IInvitation {
    return {
      Id: raw?.id,
      gatheringId: raw?.gatheringId,
      invitationStatusId: raw?.invitationStatusId,
      memberId: raw?.memberId,
      createdOnUtc: raw?.createdOnUtc,
    };
  }
}
