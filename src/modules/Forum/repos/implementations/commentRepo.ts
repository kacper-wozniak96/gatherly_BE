import { Injectable } from '@nestjs/common';
import { UserId } from 'src/modules/User/domain/UserId';
import { PrismaService } from 'src/prisma.service';
import { Comment } from '../../domain/comment';
import { CommentId } from '../../domain/commentId';
import { Comments } from '../../domain/comments';
import { PostId } from '../../domain/postId';
import { CommentMapper } from '../../mappers/Comment';
import { ICommentRepo } from '../commentRepo';

@Injectable()
export class CommentRepo implements ICommentRepo {
  constructor(private prisma: PrismaService) {}

  async save(comments: Comments): Promise<void> {
    const addedComments = comments.getNewItems();
    const deletedComments = comments.getRemovedItems();

    await Promise.all([this.createMany(addedComments), this.deleteMany(deletedComments)]);
  }

  private async createMany(comments: Comment[]): Promise<void> {
    await this.prisma.postComment.createMany({
      data: comments.map((comment) => {
        return {
          UserId: comment.userId.getValue().toValue() as number,
          PostId: comment.postId.getValue().toValue() as number,
          Text: comment.text.value,
        };
      }),
    });
  }

  private async deleteMany(comments: Comment[]): Promise<void> {
    await this.prisma.postComment.deleteMany({
      where: {
        Id: { in: comments.map((comment) => comment.id.toValue() as number) },
      },
    });
  }

  async getCommentsByPostId(postId: PostId | number, offset: number): Promise<Comment[]> {
    postId = postId instanceof PostId ? (postId.getValue().toValue() as number) : postId;

    const comments = await this.prisma.postComment.findMany({
      where: {
        PostId: postId,
      },
      include: {
        User: true,
      },
      skip: offset,
      take: 5,
      orderBy: { Id: 'desc' },
    });

    return comments.map((comment) => CommentMapper.toDomain(comment));
  }

  async getCommentByCommentId(commentId: CommentId | number): Promise<Comment> {
    commentId = commentId instanceof CommentId ? (commentId.getValue().toValue() as number) : commentId;

    const comment = await this.prisma.postComment.findUnique({
      where: {
        Id: commentId,
      },
      include: {
        User: true,
      },
    });

    return CommentMapper.toDomain(comment);
  }

  async countCommentsByPostId(postId: PostId | number): Promise<number> {
    postId = postId instanceof PostId ? (postId.getValue().toValue() as number) : postId;

    return await this.prisma.postComment.count({
      where: {
        PostId: postId,
      },
    });
  }

  async getCommentsCountByUser(userId: UserId): Promise<number> {
    return await this.prisma.postComment.count({
      where: {
        UserId: userId.getValue().toValue() as number,
      },
    });
  }
}
