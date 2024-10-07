import { Controller, Get, Inject, InternalServerErrorException, ParseIntPipe, Query } from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { GetPostsUseCaseSymbol } from '../utils/symbols';
import { GetPostsResponseDTO, RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostsController {
  constructor(@Inject(GetPostsUseCaseSymbol) private readonly getPostsUseCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Get('')
  async execute(@Query('offset', ParseIntPipe) offset: number, @Query('search') search: string): Promise<GetPostsResponseDTO | void> {
    const result = await this.getPostsUseCase.execute({ offset, search });

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
