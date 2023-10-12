export interface IInvitationService {
  create(memberId: number): Promise<any>;
}

export interface IInvitationRepo {
  create(memberId: number): Promise<any>;
}

export interface IMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
