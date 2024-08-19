import { Controller, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { DownVotePostUseCaseSymbol } from '../utils/symbols';
import { DownVotePostErrors } from './DownVotePostErrors';
import { DownVotePostResponse } from './DownVotePostResponse';
import { DownVotePostUseCase } from './DownVotePostUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class DownVotePostController {
  constructor(@Inject(DownVotePostUseCaseSymbol) private readonly downVotePostUseCase: DownVotePostUseCase) {}

  @Post('/:id/downvote')
  async execute(@Param('id', ParseIntPipe) postId: number): Promise<DownVotePostResponse | void> {
    const result = await this.downVotePostUseCase.execute({ postId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DownVotePostErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case DownVotePostErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
