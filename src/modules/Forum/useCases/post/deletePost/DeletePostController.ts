import { Controller, Delete, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
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

      switch (error.constructor) {
        case DeletePostErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
