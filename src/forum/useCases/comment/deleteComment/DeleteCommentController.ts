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
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { DeleteCommentUseCaseSymbol } from '../utils/symbols';
import { DeleteCommentErrors } from './DeleteCommentErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class DeleteCommentController {
  constructor(@Inject(DeleteCommentUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Delete('/:postId/comment/:commentId')
  async execute(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    const result = await this.useCase.execute({ postId, commentId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case DeleteCommentErrors.UserDoesntExistError:
        case DeleteCommentErrors.PostDoesntExistError:
        case DeleteCommentErrors.CommentDoesntExistError:
          throw new NotFoundException(errorValue);
        case DeleteCommentErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
