import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IPostRepo } from '../postRepo';
import { Post } from '../../domain/post';

@Injectable()
export class PostRepo implements IPostRepo {
  constructor(private prisma: PrismaService) {}

  async create(post: Post): Promise<void> {
    await this.prisma.post.create({
      data: {
        text: post?.text.value,
        title: post?.title.value,
        user: { connect: { id: post.userId.getValue().toValue() as number } },
      },
    });

    return;
  }
}
