import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostVotes } from '../../domain/postVotes';
import { IPostVoteRepo } from '../postVoteRepo';

@Injectable()
export class PostVoteRepo implements IPostVoteRepo {
  constructor(private prisma: PrismaService) {}

  async create(PostVotes: PostVotes): Promise<void> {
    const postVotes = PostVotes.getItems();

    await this.prisma.postVote.createMany({
      data: postVotes.map((postVote) => {
        return {
          UserId: postVote.memberId.getValue().toValue() as number,
          PostId: postVote.postId.getValue().toValue() as number,
          VoteId: postVote.type,
        };
      }),
    });
  }
}
