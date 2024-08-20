import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Comment } from '../../domain/comment';
import { Comments } from '../../domain/comments';
import { ICommentRepo } from '../postCommentRepo';

@Injectable()
export class CommentRepo implements ICommentRepo {
  constructor(private prisma: PrismaService) {}

  async save(comments: Comments): Promise<void> {
    const addedComments = comments.getNewItems();
    const deletedComments = comments.getRemovedItems();

    console.log({ comments });

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
}
