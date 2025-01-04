import {
  Controller,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { DownVotePostUseCaseSymbol } from '../utils/symbols';
import { DownVotePostErrors } from './DownVotePostErrors';
import { DownVotePostUseCase } from './DownVotePostUseCase';
import { ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class DownVotePostController {
  constructor(@Inject(DownVotePostUseCaseSymbol) private readonly downVotePostUseCase: DownVotePostUseCase) {}

  @Post('/:id/downvote')
  async execute(@Param('id', ParseIntPipe) postId: number): Promise<ResponseData | void> {
    const result = await this.downVotePostUseCase.execute({ postId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case DownVotePostErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case DownVotePostErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        case DownVotePostErrors.UserBannedFromVotingError:
          throw new ForbiddenException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
