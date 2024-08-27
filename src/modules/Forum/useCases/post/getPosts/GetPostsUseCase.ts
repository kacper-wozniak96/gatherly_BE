import { Inject, Injectable } from '@nestjs/common';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostMapper } from 'src/modules/Forum/mappers/Post';
import { AppError } from 'src/shared/core/AppError';
import { Either, left } from 'src/shared/core/Result';
import { GetPostsResponseDTO, GetPostsUseCaseData } from './GetPostsDTO';

type Response = Either<AppError.UnexpectedError, Result<GetPostsResponseDTO>>;

@Injectable()
export class GetPostsUseCase implements UseCase<GetPostsUseCaseData, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(useCaseData: GetPostsUseCaseData): Promise<Response> {
    const { offset } = useCaseData;

    try {
      const [posts, postsTotalCount] = await Promise.all([this.postRepo.getPosts(offset), this.postRepo.getPostsTotalCount()]);

      const postsDTO = posts.map((post) => PostMapper.toDTO(post, this.request.user.userId));

      return right(Result.ok<GetPostsResponseDTO>({ posts: postsDTO, postsTotalCount }));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
