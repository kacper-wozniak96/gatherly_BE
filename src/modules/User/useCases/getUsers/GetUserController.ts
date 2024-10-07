import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { UserDTO } from '../../dtos/user';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GetUsersUseCaseSymbol } from '../../utils/symbols';
import { ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class GetUsersController {
  constructor(@Inject(GetUsersUseCaseSymbol) private readonly useCase: UseCase<void, Promise<ResponseData>>) {}

  @Get('')
  async execute(): Promise<UserDTO[]> {
    const result = await this.useCase.execute();

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const users = result.value.getValue();

    return users;
  }
}
