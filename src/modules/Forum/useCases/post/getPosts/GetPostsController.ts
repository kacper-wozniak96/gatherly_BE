import { Controller, Get, Inject } from '@nestjs/common';
import { Post } from 'src/modules/Forum/domain/post';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { GetPostsUseCaseSymbol } from '../utils/symbols';
import { GetPostsUseCase } from './GetPostsUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostsController {
  constructor(@Inject(GetPostsUseCaseSymbol) private readonly getPostsUseCase: GetPostsUseCase) {}

  @Get('')
  async execute(): Promise<Post[]> {
    return await this.getPostsUseCase.execute();
  }
}
