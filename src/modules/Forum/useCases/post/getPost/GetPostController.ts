import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PostDTO } from 'gatherly-types';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { GetPostUseCaseSymbol } from '../utils/symbols';
import { GetPostErrors } from './GetPostErrors';
import { GetPostUseCase } from './GetPostUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostController {
  constructor(@Inject(GetPostUseCaseSymbol) private readonly getPostUseCase: GetPostUseCase) {}

  @Get('/:id')
  async execute(@Param('id', ParseIntPipe) postId: number): Promise<PostDTO | void> {
    const result = await this.getPostUseCase.execute({ postId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GetPostErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case GetPostErrors.UserBannedFromViewingPostError:
          throw new ForbiddenException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const post = result.value.getValue();
    return post;
  }
}
