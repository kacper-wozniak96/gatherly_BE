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
import { PostUserBanDTO } from 'src/modules/Forum/dtos/post';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { GetPostBansErrors } from './GetPostBansForUserErrors';
import { GetPostBansForUserUseCase, GetPostBansForUserUseCaseSymbol } from './GetPostBansForUserUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class GetPostBansForUserController {
  constructor(@Inject(GetPostBansForUserUseCaseSymbol) private readonly useCase: GetPostBansForUserUseCase) {}

  @Get('/:postId/bans/user/:userId')
  async execute(@Param('postId', ParseIntPipe) postId: number, @Param('userId', ParseIntPipe) userId: number): Promise<PostUserBanDTO[]> {
    const result = await this.useCase.execute({ postId, userId });

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
