import { Controller, Get, Inject, InternalServerErrorException, ParseIntPipe, Query } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { GetPostsUseCaseSymbol } from '../utils/symbols';
import { GetPostsResponseDTO } from './GetPostsDTO';
import { GetPostsUseCase } from './GetPostsUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostsController {
  constructor(@Inject(GetPostsUseCaseSymbol) private readonly getPostsUseCase: GetPostsUseCase) {}

  @Get('')
  async execute(@Query('offset', ParseIntPipe) offset: number): Promise<GetPostsResponseDTO | void> {
    const result = await this.getPostsUseCase.execute({ offset });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const data = result.value.getValue();

    return data;
  }
}
