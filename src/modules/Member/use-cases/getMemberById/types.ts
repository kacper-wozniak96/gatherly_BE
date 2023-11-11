import { Member } from '../../domain/member';

export interface IGetMemberByIdUseCase {
  execute(memberId: number): Promise<Member>;
}
