import { Member } from '../core/entity';

export interface IMemberService {
  getMemberById(memberId: number): Promise<Member>;
}

export interface IMemberRepo {
  getMemberById(memberId: number): Promise<Member>;
}

export interface IMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
