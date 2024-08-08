import { Inject, Injectable } from '@nestjs/common';
import { Post } from 'src/modules/Forum/domain/post';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UseCase } from 'src/shared/core/UseCase';

@Injectable()
export class GetPostsUseCase implements UseCase<undefined, Promise<Post[]>> {
  constructor(@Inject(PostRepoSymbol) private readonly postRepo: IPostRepo) {}

  async execute(): Promise<Post[]> {
    const posts = await this.postRepo.getPosts();

    return posts;
  }
}
