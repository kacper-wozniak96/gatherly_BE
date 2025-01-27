import { BadRequestException, Body, Controller, Inject, InternalServerErrorException, NotFoundException, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserRequestDTO, LoginUserResponseDTO } from 'gatherly-types';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { accessTokenCookieName } from '../../utils/cookies';
import { LoginUserUseCaseSymbol } from '../../utils/symbols';
import { LoginUseCaseErrors } from './LoginUserErrors';
import { LoginUserResponse, RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class LoginUserController {
  constructor(@Inject(LoginUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Public()
  @Post('/login')
  async execute(
    @Body() dto: LoginUserRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<(LoginUserResponseDTO & { accessToken: string }) | void> {
    const result = await this.useCase.execute({ dto });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case LoginUseCaseErrors.UserNameDoesntExistError:
          throw new NotFoundException(errorValue);
        case LoginUseCaseErrors.PasswordDoesntMatchError:
          throw new BadRequestException(errorValue);
        case LoginUseCaseErrors.InvalidDataError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    const resultSuccess: LoginUserResponse = result.value.getValue();
    response.cookie(accessTokenCookieName, resultSuccess.accessToken, { httpOnly: true });
    return { user: resultSuccess.user, accessToken: resultSuccess.accessToken };
  }
}
