import { User } from '../domain/user';
import { UserId } from '../domain/userId';
import { UserName } from '../domain/UserName';

export interface IUserRepo {
  save(member: User): Promise<void>;
  getUserByUserId(userId: UserId): Promise<User | null>;
  getUserByUsername(username: UserName): Promise<User | null>;
}
