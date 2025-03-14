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
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../utils/baseContollerPath';
import { UpVotePostUseCaseSymbol } from '../utils/symbols';
import { UpVotePostErrors } from './UpVotePostErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class UpVotePostController {
  constructor(@Inject(UpVotePostUseCaseSymbol) private readonly upVotePostUseCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Post('/:id/upvote')
  async execute(@Param('id', ParseIntPipe) postId: number): Promise<void> {
    const result = await this.upVotePostUseCase.execute({ postId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case UpVotePostErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case UpVotePostErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        case UpVotePostErrors.UserBannedFromVotingError:
          throw new ForbiddenException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
