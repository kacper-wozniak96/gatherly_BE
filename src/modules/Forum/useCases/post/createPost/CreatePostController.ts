import { Controller, Post, Body, Inject } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { CreatePostDTO } from './CreatePostDTO';
import { CreatePostUseCase } from './CreatePost';
import { CreatePostUseCaseSymbol } from '../utils/symbols';

@Controller(BASE_POST_CONTROLLER_PATH)
export class CreatePostController {
  constructor(@Inject(CreatePostUseCaseSymbol) private readonly createPostUseCase: CreatePostUseCase) {}

  @Post()
  async createMember(@Body() createPostDTO: CreatePostDTO): Promise<void> {
    await this.createPostUseCase.execute(createPostDTO);
    return;
  }
}
