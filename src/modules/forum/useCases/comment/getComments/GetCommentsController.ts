import { Controller, Get, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { GetCommentsUseCaseSymbol } from '../utils/symbols';
import { GetCommentsErrors } from './GetCommentsErrors';
import { GetCommentsResponseDTO, RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetCommentsController {
  constructor(@Inject(GetCommentsUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Get('/:postId/comments')
  async execute(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<GetCommentsResponseDTO | void> {
    const result = await this.useCase.execute({ postId, offset });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case GetCommentsErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    const comments = result.value.getValue();

    return comments;
  }
}
