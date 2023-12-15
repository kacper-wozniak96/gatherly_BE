import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserUseCaseSymbol } from '../../utils/symbols';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { Public } from 'src/modules/AuthModule/Auth.guard';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UserCreateController {
  constructor(@Inject(CreateUserUseCaseSymbol) private readonly useCase: CreateUserUseCase) {}

  @Public()
  @Post()
  async createMember(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    await this.useCase.execute(createUserDTO);
  }
}
