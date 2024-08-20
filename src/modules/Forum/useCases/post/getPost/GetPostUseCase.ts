import { Inject, Injectable } from '@nestjs/common';
import { Post } from 'src/modules/Forum/domain/post';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';

import { PostId } from 'src/modules/Forum/domain/postId';
import { AppError } from 'src/shared/core/AppError';
import { Either, left } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { GetPostDTO } from './GetPostDTO';

type Response = Either<AppError.UnexpectedError, Result<Post>>;

@Injectable()
export class GetPostUseCase implements UseCase<undefined, Promise<Response>> {
  constructor(@Inject(PostRepoSymbol) private readonly postRepo: IPostRepo) {}

  async execute(getPostDTO: GetPostDTO): Promise<Response> {
    const postIdOrError = PostId.create(new UniqueEntityID(getPostDTO.postId));

    const dtoResult = Result.combine([postIdOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const postId = postIdOrError.getValue();

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new AppError.UnexpectedError());

    return right(Result.ok<Post>(post));
  }
}
