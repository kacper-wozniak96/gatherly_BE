import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, NotFoundException, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { accessTokenCookieName } from '../../utils/cookies';
import { LoginUserUseCaseSymbol } from '../../utils/symbols';
import { LoginUseCaseErrors } from './LoginUserErrors';
import { LoginUserRequestDTO, LoginUserResponse, LoginUserResponseDTO, RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class LoginUserController {
  constructor(@Inject(LoginUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Public()
  @Post('/login')
  async execute(@Body() dto: LoginUserRequestDTO, @Res({ passthrough: true }) response: Response): Promise<LoginUserResponseDTO | void> {
    const result = await this.useCase.execute({ dto });

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

    const resultSuccess: LoginUserResponse = result.value.getValue();
    response.cookie(accessTokenCookieName, resultSuccess.accessToken, { httpOnly: true });
    return { user: resultSuccess.user };
  }
}
