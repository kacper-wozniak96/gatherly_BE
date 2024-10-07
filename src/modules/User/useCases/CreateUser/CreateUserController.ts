import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { CreateUserUseCaseSymbol } from '../../utils/symbols';
import { CreateUserErrors } from './CreateUserErrors';
import { CreateUserDTO, RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UserCreateController {
  constructor(@Inject(CreateUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Public()
  @Post()
  async createUser(@Body() dto: CreateUserDTO): Promise<void> {
    const result = await this.useCase.execute({ dto });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateUserErrors.PasswordsDoNotMatchError:
          throw new BadRequestException(error.getErrorValue());
        case CreateUserErrors.UsernameTakenError:
          throw new BadRequestException(error.getErrorValue());
        case CreateUserErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
