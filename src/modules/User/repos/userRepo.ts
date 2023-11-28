import { User } from '../domain/user';
import { UserId } from '../domain/userId';
import { UserUsername } from '../domain/userUsername';

export interface IUserRepo {
  save(member: User): Promise<void>;
  getUserByUserId(userId: UserId): Promise<User | null>;
  getUserByUsername(username: UserUsername): Promise<User | null>;
}
