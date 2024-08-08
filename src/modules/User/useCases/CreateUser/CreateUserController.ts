import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { CreateUserUseCaseSymbol } from '../../utils/symbols';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserErrors } from './CreateUserErrors';
import { CreateUserUseCase } from './CreateUserUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UserCreateController {
  constructor(@Inject(CreateUserUseCaseSymbol) private readonly useCase: CreateUserUseCase) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    const result = await this.useCase.execute(createUserDTO);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateUserErrors.PasswordsDoNotMatchError:
          throw new BadRequestException(error.getErrorValue().message);
        case CreateUserErrors.UsernameTakenError:
          throw new BadRequestException(error.getErrorValue().message);
        default:
          throw new InternalServerErrorException(error.getErrorValue().message);
      }
    }

    return;
  }
}
