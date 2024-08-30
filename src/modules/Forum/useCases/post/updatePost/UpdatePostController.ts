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
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { UpdatePostUseCaseSymbol } from '../utils/symbols';
import { UpdatePostRequestDTO } from './UpdatePostDTO';
import { UpdatePostErrors } from './UpdatePostErrors';
import { UpdatePostUseCase } from './UpdatePostUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class UpdatePostController {
  constructor(@Inject(UpdatePostUseCaseSymbol) private readonly useCase: UpdatePostUseCase) {}

  @Patch('/:id')
  async updatePost(@Param('id', ParseIntPipe) postId: number, @Body() updatePostDTO: UpdatePostRequestDTO): Promise<void> {
    const result = await this.useCase.execute({ ...updatePostDTO, postId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UpdatePostErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case UpdatePostErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case UpdatePostErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
