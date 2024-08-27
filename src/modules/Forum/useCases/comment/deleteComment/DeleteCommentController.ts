import {
  BadRequestException,
  Controller,
  Delete,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { DeleteCommentUseCaseSymbol } from '../utils/symbols';
import { DeleteCommentUseCase } from './DeleteComment';
import { DeleteCommentErrors } from './DeleteCommentErrors';

@Controller(BASE_POST_CONTROLLER_PATH)
export class DeleteCommentController {
  constructor(@Inject(DeleteCommentUseCaseSymbol) private readonly deleteCommentUseCase: DeleteCommentUseCase) {}

  @Delete('/:postId/comment/:commentId')
  async execute(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    const result = await this.deleteCommentUseCase.execute({ postId, commentId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeleteCommentErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case DeleteCommentErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case DeleteCommentErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
