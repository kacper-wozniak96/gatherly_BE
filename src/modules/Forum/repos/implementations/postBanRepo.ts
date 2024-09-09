import { Injectable } from '@nestjs/common';
import { UserId } from 'src/modules/User/domain/UserId';
import { PrismaService } from 'src/prisma.service';
import { PostBan } from '../../domain/postBan';
import { PostBans } from '../../domain/postBans';
import { PostId } from '../../domain/postId';
import { PostBanMapper } from '../../mappers/PostBan';
import { IPostBanRepo } from '../postBanRepo';

@Injectable()
export class PostBanRepo implements IPostBanRepo {
  constructor(private prisma: PrismaService) {}

  async getUserPostBans(postId: PostId, userId: UserId): Promise<PostBan[]> {
    const postIdValue = postId.getValue().toValue() as number;
    const userIdValue = userId.getValue().toValue() as number;

    const postBans = await this.prisma.postBan.findMany({
      where: {
        PostId: postIdValue,
        UserId: userIdValue,
      },
    });

    return postBans.map((postBan) => PostBanMapper.toDomain(postBan));
  }

  async save(postBans: PostBans): Promise<void> {
    const newPostBans = postBans.getNewItems();
    const deletedPostBans = postBans.getRemovedItems();

    await this.deleteMany(deletedPostBans);
    await this.createMany(newPostBans);
  }

  private async createMany(postBans: PostBan[]): Promise<void> {
    await this.prisma.postBan.createMany({
      data: postBans.map((postBan) => {
        return {
          PostId: postBan.postId.getValue().toValue() as number,
          UserId: postBan.userId.getValue().toValue() as number,
          BanTypeId: postBan.type.value,
        };
      }),
    });
  }

  private async deleteMany(postBans: PostBan[]): Promise<void> {
    await this.prisma.postBan.deleteMany({
      where: {
        Id: {
          in: postBans.map((postBan) => postBan.id.toValue() as number),
        },
      },
    });
  }
}
