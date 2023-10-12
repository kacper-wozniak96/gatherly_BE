export interface IMemberService {
  getById(memberId: number): Promise<any>;
}

export interface IMemberRepo {
  getById(memberId: number): Promise<any>;
}

export interface IMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
