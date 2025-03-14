import { BadRequestException, Controller, Get, Inject, InternalServerErrorException, Param, ParseIntPipe } from '@nestjs/common';
import { UserDTO } from 'gatherly-types';
import { UseCase } from 'src/shared/core/UseCase';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GetUserUseCaseSymbol } from '../../utils/symbols';
import { GetUserErrors } from './GetUserErrors';
import { RequestData, ResponseData } from './types';

@Controller(BASE_USER_CONTROLLER_PATH)
export class GetUserController {
  constructor(@Inject(GetUserUseCaseSymbol) private readonly useCase: UseCase<RequestData, Promise<ResponseData>>) {}

  @Get('/:id')
  async execute(@Param('id', ParseIntPipe) userId: number): Promise<UserDTO> {
    const result = await this.useCase.execute({ userId });

    if (result.isLeft()) {
      const error = result.value;

      const errorValue = error.getErrorValue();

      switch (error.constructor) {
        case GetUserErrors.UserDoesntExistError:
          throw new BadRequestException(errorValue);
        default:
          throw new InternalServerErrorException(errorValue);
      }
    }

    const user = result.value.getValue();

    return user;
  }
}
