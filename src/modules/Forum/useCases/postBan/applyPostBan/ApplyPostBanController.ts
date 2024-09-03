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
import { BASE_POST_CONTROLLER_PATH } from '../../post/utils/baseContollerPath';
import { ApplyBanUseCaseSymbol } from '../../post/utils/symbols';
import { ApplyPostBanRequestDTO } from './ApplyPostBanDTO';
import { ApplyPostBanErrors } from './ApplyPostBanErrors';
import { ApplyPostBanResponse } from './ApplyPostBanResponse';
import { ApplyPostBanUseCase } from './ApplyPostBanUseCase';

@Controller(BASE_POST_CONTROLLER_PATH)
export class ApplyPostBanController {
  constructor(@Inject(ApplyBanUseCaseSymbol) private readonly applyPostBanUseCase: ApplyPostBanUseCase) {}

  @Post('/:id/applyBan')
  async execute(
    @Param('id', ParseIntPipe) postId: number,
    @Body() applyPostBanDTO: ApplyPostBanRequestDTO,
  ): Promise<ApplyPostBanResponse | void> {
    const result = await this.applyPostBanUseCase.execute({ postId, dto: applyPostBanDTO });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ApplyPostBanErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case ApplyPostBanErrors.BannedUserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case ApplyPostBanErrors.PostNotCreatedByUserError:
          throw new UnauthorizedException(error.getErrorValue());
        case ApplyPostBanErrors.PostDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
