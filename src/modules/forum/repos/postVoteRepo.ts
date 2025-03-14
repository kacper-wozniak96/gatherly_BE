import { UserId } from 'src/modules/user/domain/UserId';
import { PostId } from '../domain/postId';
import { PostVote } from '../domain/postVote';
import { PostVotes } from '../domain/postVotes';

export interface IPostVoteRepo {
  create(postVotes: PostVotes): Promise<void>;
  getVotesForPostByUserId(postId: PostId, userId: UserId): Promise<PostVote[]>;
  save(postVotes: PostVotes): Promise<void>;
  getDownvotesCountByUser(userId: UserId): Promise<number>;
  getUpvotesCountByUser(userId: UserId): Promise<number>;
}
