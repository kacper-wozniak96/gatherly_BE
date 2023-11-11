import { Member } from '../domain/member';

export interface IMemberService {
  getMemberById(memberId: number): Promise<Member>;
}

export interface IMemberRepo {
  getMemberById(memberId: number): Promise<Member | null>;
  getMemberByEmail(email: string): Promise<Member | null>;
  save: (member: Member) => Promise<void>;
}

export interface IMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
