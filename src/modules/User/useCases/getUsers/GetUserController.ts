import { Controller, Get, Inject, InternalServerErrorException, Query } from '@nestjs/common';
import { UserDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GetUsersUseCaseSymbol } from '../../utils/symbols';
import { RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class GetUsersController {
  constructor(@Inject(GetUsersUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Get('')
  async execute(@Query('search') search: string): Promise<UserDTO[]> {
    const result = await this.useCase.execute({ search });

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
