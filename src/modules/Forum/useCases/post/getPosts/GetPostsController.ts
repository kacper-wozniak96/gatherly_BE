import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostDTO } from 'src/modules/Forum/dtos/post';
import { PostMapper } from 'src/modules/Forum/mappers/Post';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { GetPostsUseCaseSymbol } from '../utils/symbols';
import { GetPostsUseCase } from './GetPostsUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostsController {
  constructor(
    @Inject(GetPostsUseCaseSymbol) private readonly getPostsUseCase: GetPostsUseCase,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  @Get('')
  async execute(): Promise<PostDTO[] | void> {
    const result = await this.getPostsUseCase.execute();

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const posts = result.value.getValue();

    return posts.map((post) => PostMapper.toDTO(post, this.request.user.userId));
  }
}
