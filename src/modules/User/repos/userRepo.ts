import { User } from '../domain/User';
import { UserId } from '../domain/UserId';
import { UserName } from '../domain/UserName';

export interface IUserRepo {
  save(member: User): Promise<void>;
  getUserByUserId(userId: UserId): Promise<User | null>;
  getUserByUsername(username: UserName): Promise<User | null>;
}
