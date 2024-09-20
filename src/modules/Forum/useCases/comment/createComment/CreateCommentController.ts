import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { CreateCommentUseCaseSymbol } from '../utils/symbols';
import { CreateCommentErrors } from './CreateCommentErrors';
import { CreateCommentRequestDTO, RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class CreateCommentController {
  constructor(@Inject(CreateCommentUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Post('/:postId/comment')
  async execute(@Param('postId', ParseIntPipe) postId: number, @Body() dto: CreateCommentRequestDTO): Promise<void> {
    const result = await this.useCase.execute({
      postId,
      dto,
    });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case CreateCommentErrors.UserDoesntExistError:
        case CreateCommentErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        case CreateCommentErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
