import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UpdatePostRequestDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { UpdatePostUseCaseSymbol } from '../utils/symbols';
import { UpdatePostErrors } from './UpdatePostErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class UpdatePostController {
  constructor(@Inject(UpdatePostUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Patch('/:id')
  async updatePost(@Param('id', ParseIntPipe) postId: number, @Body() dto: UpdatePostRequestDTO): Promise<void> {
    const result = await this.useCase.execute({ dto, postId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case UpdatePostErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        case UpdatePostErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case UpdatePostErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
