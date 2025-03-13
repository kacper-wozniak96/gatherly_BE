import { Inject, Injectable } from '@nestjs/common';

import { IPostRepo } from 'src/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/forum/repos/utils/symbols';
import { right } from 'src/shared/core/Either';
import { UseCase } from 'src/shared/core/UseCase';

import { REQUEST } from '@nestjs/core';
import { GetPostsResponseDTO } from 'gatherly-types';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostMapper } from 'src/forum/mappers/Post';
import { Result } from 'src/shared/core/Result';
import { RequestData, ResponseData } from './types';

@Injectable()
export class GetPostsUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const { offset, search } = requestData;

    const [posts, postsTotalCount] = await Promise.all([this.postRepo.getPosts(offset, search), this.postRepo.getPostsTotalCount(search)]);

    console.log({ userId: this.request.user.userId });

    const postsDTO = posts.map((post) => PostMapper.toDTO(post, this.request.user.userId));

    return right(Result.ok<GetPostsResponseDTO>({ posts: postsDTO, postsTotalCount }));
  }
}
