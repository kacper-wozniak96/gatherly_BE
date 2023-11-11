import { Invitation } from '../domain/entities/Invitation';
import { IInvitation } from '../utils/types/Invitation';

export class InvitationMapper {
  public static toDomain(props: IInvitation): Invitation {
    return Invitation.create(props, props.Id);
  }
}
