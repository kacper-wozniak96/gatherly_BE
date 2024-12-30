import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserRequestDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { UpdateUserUseCaseSymbol } from '../../utils/symbols';
import { UpdateUserErrors } from './UpdateUserErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UpdateUserController {
  constructor(@Inject(UpdateUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Post('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserRequestDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const result = await this.useCase.execute({ dto, userId, file });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case UpdateUserErrors.UserDoesntExistError:
          throw new NotFoundException(errorValue);
        case UpdateUserErrors.UsernameTakenError:
          throw new BadRequestException(errorValue);
        case UpdateUserErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        case UpdateUserErrors.CannotUpdateGuestUserError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
