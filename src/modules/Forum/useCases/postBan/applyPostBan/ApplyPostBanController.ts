import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplyPostBanRequestDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { ApplyBanUseCaseSymbol } from '../../post/utils/symbols';
import { ApplyPostBanErrors } from './ApplyPostBanErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_POST_CONTROLLER_PATH)
export class ApplyPostBanController {
  constructor(@Inject(ApplyBanUseCaseSymbol) private readonly applyPostBanUseCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Post('/:id/bans/user/:bannedUserId')
  async execute(
    @Param('id', ParseIntPipe) postId: number,
    @Param('bannedUserId', ParseIntPipe) bannedUserId: number,
    @Body() applyPostBanDTO: ApplyPostBanRequestDTO,
  ): Promise<void> {
    const result = await this.applyPostBanUseCase.execute({ postId, dto: applyPostBanDTO, bannedUserId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case ApplyPostBanErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case ApplyPostBanErrors.BannedUserDoesntExistError:
          throw new NotFoundException(errorValue);
        case ApplyPostBanErrors.PostNotCreatedByUserError:
          throw new UnauthorizedException(errorValue);
        case ApplyPostBanErrors.PostDoesntExistError:
          throw new NotFoundException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
