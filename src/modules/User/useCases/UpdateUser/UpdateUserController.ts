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
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { UpdateUserUseCaseSymbol } from '../../utils/symbols';
import { UpdateUserRequestDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';
import { UpdateUserUseCase } from './UpdateUserUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UpdateUserController {
  constructor(@Inject(UpdateUserUseCaseSymbol) private readonly useCase: UpdateUserUseCase) {}

  @Post('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDTO: UpdateUserRequestDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const result = await this.useCase.execute({ ...updateUserDTO, userId, file });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UpdateUserErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case UpdateUserErrors.UsernameTakenError:
          throw new BadRequestException(error.getErrorValue());
        case UpdateUserErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
