import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateUserUseCase } from './CreateUser';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserUseCaseSymbol } from '../utils/symbols';
import { BASE_USER_CONTROLLER_PATH } from '../utils/baseContollerPath';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UserCreateController {
  constructor(@Inject(CreateUserUseCaseSymbol) private readonly useCase: CreateUserUseCase) {}

  @Post()
  async createMember(@Body() createUserDTO: CreateUserDTO): Promise<void> {
    await this.useCase.execute(createUserDTO);
  }
}
