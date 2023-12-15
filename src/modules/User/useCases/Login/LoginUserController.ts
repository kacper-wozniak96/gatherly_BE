import { Controller, Post, Body, Inject } from '@nestjs/common';
import { LoginUserUseCaseSymbol } from '../../utils/symbols';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { Public } from 'src/modules/AuthModule/Auth.guard';
import { LoginUserDTO, LoginUserResponseDTO } from './LoginUserDTO';
import { LoginUserUseCase } from './LoginUserUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class LoginUserController {
  constructor(@Inject(LoginUserUseCaseSymbol) private readonly useCase: LoginUserUseCase) {}

  @Public()
  @Post('login')
  async createMember(@Body() loginUserDTO: LoginUserDTO): Promise<LoginUserResponseDTO | void> {
    return await this.useCase.execute(loginUserDTO);
  }
}
