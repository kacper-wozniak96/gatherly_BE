import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Comments } from '../../domain/comments';
import { Post } from '../../domain/post';
import { PostId } from '../../domain/postId';
import { PostVotes } from '../../domain/postVotes';
import { PostMapper } from '../../mappers/Post';
import { ICommentRepo } from '../commentRepo';
import { IPostRepo } from '../postRepo';
import { IPostVoteRepo } from '../postVoteRepo';
import { CommentRepoSymbol, PostVoteRepoSymbol } from '../utils/symbols';

@Injectable()
export class PostRepo implements IPostRepo {
  constructor(
    private prisma: PrismaService,
    @Inject(PostVoteRepoSymbol) private readonly postVoteRepo: IPostVoteRepo,
    @Inject(CommentRepoSymbol) private readonly postCommentRepo: ICommentRepo,
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
          IsDeleted: Post.isDeleted,
        },
      });

      await this.savePostVotes(Post.votes);
      await this.saveComments(Post.comments);

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

  private async saveComments(comments: Comments) {
    return await this.postCommentRepo.save(comments);
  }

  async getPosts(offset: number, search: string): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        User: true,
        PostVote: true,
        PostComment: {
          include: {
            User: true,
            Post: true,
          },
        },
      },
      where: {
        AND: [
          { IsDeleted: false },
          {
            OR: [
              {
                Title: { contains: search },
              },
              {
                Text: { contains: search },
              },
            ],
          },
        ],
      },
      skip: offset,
      take: 5,
      orderBy: { Id: 'desc' },
    });

    return posts.map((post) => {
      return PostMapper.toDomain(post);
    });
  }

  async getPostsTotalCount(search: string): Promise<number> {
    return await this.prisma.post.count({
      where: {
        AND: [
          { IsDeleted: false },
          {
            OR: [
              {
                Title: { contains: search },
              },
              {
                Text: { contains: search },
              },
            ],
          },
        ],
      },
    });
  }

  async getPostByPostId(PostId: PostId): Promise<Post | null> {
    const postId = PostId.getValue().toValue() as number;

    const post = await this.prisma.post.findUnique({
      where: { Id: postId },
      include: {
        User: true,
        PostVote: true,
        PostComment: {
          include: {
            Post: true,
            User: true,
          },
          take: 5,
        },
      },
    });

    if (!post) return null;

    return PostMapper.toDomain(post);
  }
}
