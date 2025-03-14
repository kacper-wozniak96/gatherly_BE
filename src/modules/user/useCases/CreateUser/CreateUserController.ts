import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { CreateUserRequestDTO } from 'gatherly-types';
import { Public } from 'src/modules/Auth/Auth.guard';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { CreateUserUseCaseSymbol } from '../../utils/symbols';
import { CreateUserErrors } from './CreateUserErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UserCreateController {
  constructor(@Inject(CreateUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Public()
  @Post()
  async createUser(@Body() dto: CreateUserRequestDTO): Promise<void> {
    const result = await this.useCase.execute({ dto });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case CreateUserErrors.PasswordsDoNotMatchError:
          throw new BadRequestException(errorValue);
        case CreateUserErrors.UsernameTakenError:
          throw new BadRequestException(errorValue);
        case CreateUserErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    return;
  }
}
