import {
  Controller,
  Delete,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { DeletePostUseCaseSymbol } from '../utils/symbols';
import { DeletePostErrors } from './DeletePostErrors';
import { DeletePostUseCase } from './DeletePostUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class DeletePostController {
  constructor(@Inject(DeletePostUseCaseSymbol) private readonly deletePostUseCase: DeletePostUseCase) {}

  @Delete('/:postId')
  async execute(@Param('postId', ParseIntPipe) postId: number): Promise<void> {
    const result = await this.deletePostUseCase.execute({ postId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case DeletePostErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        case DeletePostErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case DeletePostErrors.UserDoesntOwnPostError:
          throw new ForbiddenException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
