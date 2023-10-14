import { Invitation } from '../Core/entity';

export class InvitationMapper {
  public static toDomain(gatheringId: number, memeberId: number): Invitation {
    return Invitation.create(gatheringId, memeberId);
  }
}
