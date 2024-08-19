import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import { Post } from '../../domain/post';
import { PostId } from '../../domain/postId';
import { PostVotes } from '../../domain/postVotes';
import { PostMapper } from '../../mappers/Post';
import { IPostRepo } from '../postRepo';
import { IPostVoteRepo } from '../postVoteRepo';
import { PostVoteRepoSymbol } from '../utils/symbols';

@Injectable()
export class PostRepo implements IPostRepo {
  constructor(
    private prisma: PrismaService,
    @Inject(PostVoteRepoSymbol) private readonly postVoteRepo: IPostVoteRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
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

      await this.savePostVotes(Post.votes);

      return;
    }

    await this.prisma.post.create({
      data: {
        Title: Post.title.value,
        Text: Post.text.value,
        User: { connect: { Id: Post.userId.getValue().toValue() as number } },
        PostVote: {
          create: Post.votes.getItems().map((vote) => {
            return {
              UserId: vote.userId.getValue().toValue() as number,
              VoteId: vote.type,
            };
          }),
        },
      },
    });
  }

  private async savePostVotes(postVotes: PostVotes) {
    return await this.postVoteRepo.save(postVotes);
  }

  async getPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      include: { User: true, PostVote: true },
      orderBy: { Id: 'desc' },
    });

    return posts.map((post) => {
      return PostMapper.toDomain(post, this.request.user.userId);
    });
  }

  async getPostByPostId(PostId: PostId): Promise<Post | null> {
    const postId = PostId.getValue().toValue() as number;

    const post = await this.prisma.post.findUnique({
      where: { Id: postId },
      include: { User: true, PostVote: true },
    });

    if (!post) return null;

    return PostMapper.toDomain(post);
  }
}
