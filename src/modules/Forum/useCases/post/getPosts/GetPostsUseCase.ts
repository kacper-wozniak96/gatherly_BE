import { Inject, Injectable } from '@nestjs/common';
import { Post } from 'src/modules/Forum/domain/post';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';

import { AppError } from 'src/shared/core/AppError';
import { Either, left } from 'src/shared/core/Result';

type Response = Either<AppError.UnexpectedError, Result<Post[]>>;

@Injectable()
export class GetPostsUseCase implements UseCase<undefined, Promise<Response>> {
  constructor(@Inject(PostRepoSymbol) private readonly postRepo: IPostRepo) {}

  async execute(): Promise<Response> {
    try {
      const posts = await this.postRepo.getPosts();
      return right(Result.ok<Post[]>(posts));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
