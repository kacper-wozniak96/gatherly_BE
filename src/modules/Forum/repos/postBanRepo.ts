import { UserId } from 'src/modules/User/domain/UserId';
import { PostBan } from '../domain/postBan';
import { PostBans } from '../domain/postBans';
import { PostId } from '../domain/postId';

export interface IPostBanRepo {
  getUserPostBans(postId: PostId, userId: UserId): Promise<PostBan[]>;
  save(postBans: PostBans): Promise<void>;
}

export const PostBanRepoSymbol = Symbol('PostBanRepoSymbol');
