import { IMember } from './types';

export class MemberMapper {
  public static toDomain(raw: any): IMember {
    return {
      id: raw?.id,
      email: raw?.email,
      firstName: raw?.firstName,
      lastName: raw?.lastName,
    };
  }
}
