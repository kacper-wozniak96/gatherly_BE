import { PostVotes } from '../domain/postVotes';

export interface IPostVoteRepo {
  create(postVotes: PostVotes): Promise<void>;
}
