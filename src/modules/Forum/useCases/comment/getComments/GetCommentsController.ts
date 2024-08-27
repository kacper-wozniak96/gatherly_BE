import { Controller, Get, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { GetCommentsUseCaseSymbol } from '../utils/symbols';
import { GetCommentsResponseDTO } from './GetCommentsDTO';
import { GetCommentsErrors } from './GetCommentsErrors';
import { GetCommentsUseCase } from './GetCommentsUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetCommentsController {
  constructor(@Inject(GetCommentsUseCaseSymbol) private readonly getCommentsUseCase: GetCommentsUseCase) {}

  @Get('/:postId/comments')
  async execute(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<GetCommentsResponseDTO | void> {
    const result = await this.getCommentsUseCase.execute({ postId, offset });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GetCommentsErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const comments = result.value.getValue();

    return comments;
  }
}
