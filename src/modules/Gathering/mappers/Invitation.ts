import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { Invitation } from '../domain/Invitation';

export class InvitationMapper {
  public static toDomain(props: any): Invitation {
    return Invitation.create(props, new UniqueEntityID(props?.Id));
  }
}
