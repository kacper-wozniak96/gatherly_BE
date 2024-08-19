import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { LoginUserUseCaseSymbol } from '../../utils/symbols';
import { LoginUserDTO, LoginUserResponseDTO } from './LoginUserDTO';
import { LoginUseCaseErrors } from './LoginUserErrors';
import { LoginUserUseCase } from './LoginUserUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class LoginUserController {
  constructor(@Inject(LoginUserUseCaseSymbol) private readonly useCase: LoginUserUseCase) {}

  @Public()
  @Post('login')
  async execute(@Body() loginUserDTO: LoginUserDTO): Promise<LoginUserResponseDTO | void> {
    const result = await this.useCase.execute(loginUserDTO);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case LoginUseCaseErrors.UserNameDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        case LoginUseCaseErrors.PasswordDoesntMatchError:
          throw new BadRequestException(error.getErrorValue());
        case LoginUseCaseErrors.InvalidDataError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const responseDTO: LoginUserResponseDTO = result.value.getValue();
    return responseDTO;
  }
}
