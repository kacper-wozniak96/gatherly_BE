import { Member } from '../../domain/member';
import { MemberId } from '../../domain/memberId';

export interface IGetMemberByIdUseCase {
  execute(memberId: MemberId): Promise<Member>;
}
