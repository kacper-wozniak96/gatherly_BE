import { Controller, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { UpVotePostUseCaseSymbol } from '../utils/symbols';
import { UpVotePostErrors } from './UpVotePostErrors';
import { UpVotePostUseCase } from './UpVotePostUseCase';
import { UpVotePostResponse } from './UpvotePostResponse';

@Controller(BASE_POST_CONTROLLER_PATH)
export class UpVotePostController {
  constructor(@Inject(UpVotePostUseCaseSymbol) private readonly upVotePostUseCase: UpVotePostUseCase) {}

  @Post('/:id/upvote')
  async execute(@Param('id', ParseIntPipe) postId: number): Promise<UpVotePostResponse | void> {
    const result = await this.upVotePostUseCase.execute({ postId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UpVotePostErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case UpVotePostErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
