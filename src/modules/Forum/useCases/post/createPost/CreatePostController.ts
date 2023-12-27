import { Controller, Post, Body, Inject } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { CreatePostDTO } from './CreatePostDTO';
import { CreatePostUseCase } from './CreatePost';
import { CreatePostUseCaseSymbol } from '../utils/symbols';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';

@Controller(BASE_POST_CONTROLLER_PATH)
export class CreatePostController {
  constructor(
    @Inject(CreatePostUseCaseSymbol) private readonly createPostUseCase: CreatePostUseCase,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  @Post()
  async createMember(@Body() createPostDTO: CreatePostDTO): Promise<void> {
    await this.createPostUseCase.execute({ ...createPostDTO, userId: this.request.user.userId });
    return;
  }
}
