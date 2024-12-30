import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { PostBanDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { GetPostBansForUserUseCaseSymbol } from '../utils/symbols';
import { GetPostBansErrors } from './GetPostBansForUserErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostBansForUserController {
  constructor(@Inject(GetPostBansForUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Get('/:postId/bans/user/:userId')
  async execute(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) searchedUserId: number,
  ): Promise<PostBanDTO[]> {
    const result = await this.useCase.execute({ postId, searchedUserId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GetPostBansErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case GetPostBansErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case GetPostBansErrors.UserDoesntOwnPostError:
          throw new UnauthorizedException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const users = result.value.getValue();

    return users;
  }
}
