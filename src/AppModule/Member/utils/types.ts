export interface IMemberService {
  getMemberById(memberId: number): Promise<any>;
}

export interface IMemberRepo {
  getMemberById(memberId: number): Promise<any>;
}

export interface IMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
