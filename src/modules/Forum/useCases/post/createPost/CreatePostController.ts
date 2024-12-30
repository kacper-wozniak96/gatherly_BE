import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { CreatePostRequestDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { CreatePostUseCaseSymbol } from '../utils/symbols';
import { CreatePostErrors } from './CreatePostErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class CreatePostController {
  constructor(@Inject(CreatePostUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Post('')
  async execute(@Body() dto: CreatePostRequestDTO): Promise<void> {
    const result = await this.useCase.execute({ dto });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case CreatePostErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case CreatePostErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
