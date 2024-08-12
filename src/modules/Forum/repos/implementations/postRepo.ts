import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Post } from '../../domain/post';
import { PostMapper } from '../../mappers/Post';
import { IPostRepo } from '../postRepo';
import { IPostVoteRepo } from '../postVoteRepo';
import { PostVoteRepoSymbol } from '../utils/symbols';

@Injectable()
export class PostRepo implements IPostRepo {
  constructor(
    private prisma: PrismaService,
    @Inject(PostVoteRepoSymbol) private readonly postVoteRepo: IPostVoteRepo,
  ) {}

  async save(Post: Post): Promise<void> {
    const postId = Post.postId.getValue().toValue();

    const exists = Number.isInteger(postId);

    if (exists) {
      await this.prisma.post.update({
        where: { Id: Post.postId.getValue().toValue() as number },
        data: {
          Text: Post.text.value,
          Title: Post.title.value,
        },
      });

      return;
    }

    await this.prisma.post.create({
      // data: PostMapper.toPersistance(Post),
      data: {
        Title: Post.title.value,
        Text: Post.text.value,
        User: { connect: { Id: Post.userId.getValue().toValue() as number } },
        PostVote: {
          create: Post.votes.getItems().map((vote) => {
            return {
              UserId: vote.memberId.getValue().toValue() as number,
              VoteId: vote.type,
            };
          }),
        },
      },
    });
    // await this.postVoteRepo.create(Post.votes);
  }

  async getPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      include: { User: true },
    });

    return posts.map((post) => {
      return PostMapper.toDomain(post);
    });
  }
}
