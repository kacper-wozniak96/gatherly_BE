import { Injectable } from '@nestjs/common';
import { UserId } from 'src/modules/user/domain/UserId';
import { PrismaService } from 'src/prisma.service';
import { PostId } from '../../domain/postId';
import { EVoteType, PostVote } from '../../domain/postVote';
import { PostVotes } from '../../domain/postVotes';
import { PostVoteMapper } from '../../mappers/PostVote';
import { IPostVoteRepo } from '../postVoteRepo';

@Injectable()
export class PostVoteRepo implements IPostVoteRepo {
  constructor(private prisma: PrismaService) {}

  async save(votes: PostVotes): Promise<void> {
    const addedPostVotes = votes.getNewItems();
    const deletedPostVotes = votes.getRemovedItems();

    await Promise.all([this.createMany(addedPostVotes), this.deleteMany(deletedPostVotes)]);
  }

  private async createMany(postVotes: PostVote[]): Promise<void> {
    await this.prisma.postVote.createMany({
      data: postVotes.map((postVote) => {
        return {
          UserId: postVote.userId.getValue().toValue() as number,
          PostId: postVote.postId.getValue().toValue() as number,
          VoteId: postVote.type,
        };
      }),
    });
  }

  private async deleteMany(postVotes: PostVote[]): Promise<void> {
    await this.prisma.postVote.deleteMany({
      where: {
        Id: { in: postVotes.map((postVote) => postVote.id.toValue() as number) },
      },
    });
  }

  async create(PostVotes: PostVotes): Promise<void> {
    const postVotes = PostVotes.getItems();

    await this.prisma.postVote.createMany({
      data: postVotes.map((postVote) => {
        return {
          UserId: postVote.userId.getValue().toValue() as number,
          PostId: postVote.postId.getValue().toValue() as number,
          VoteId: postVote.type,
        };
      }),
    });
  }

  async getVotesForPostByUserId(PostId: PostId, UserId: UserId): Promise<PostVote[]> {
    const postId = PostId.getValue().toValue() as number;
    const userId = UserId.getValue().toValue() as number;

    const postVotes = await this.prisma.postVote.findMany({
      where: {
        PostId: postId,
        UserId: userId,
      },
    });

    return postVotes.map((postVote) => PostVoteMapper.toDomain(postVote));
  }

  async getDownvotesCountByUser(UserId: UserId): Promise<number> {
    const userId = UserId.getValue().toValue() as number;

    const downvotesCount = await this.prisma.postVote.count({
      where: {
        UserId: userId,
        VoteId: EVoteType.DOWNVOTE,
      },
    });

    return downvotesCount;
  }

  async getUpvotesCountByUser(UserId: UserId): Promise<number> {
    const userId = UserId.getValue().toValue() as number;

    const upvotesCount = await this.prisma.postVote.count({
      where: {
        UserId: userId,
        VoteId: EVoteType.UPVOTE,
      },
    });

    return upvotesCount;
  }
}
