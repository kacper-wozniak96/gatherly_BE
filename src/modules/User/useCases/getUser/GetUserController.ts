import { BadRequestException, Controller, Get, Inject, InternalServerErrorException, Param, ParseIntPipe } from '@nestjs/common';
import { UserDTO } from '../../dtos/user';
import { UserMapper } from '../../mappers/User';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { GetUserUseCaseSymbol } from '../../utils/symbols';
import { GetUserErrors } from './GetUserErrors';
import { GetUserUseCase } from './GetUserUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class GetUserController {
  constructor(@Inject(GetUserUseCaseSymbol) private readonly useCase: GetUserUseCase) {}

  @Get('/:id')
  async execute(@Param('id', ParseIntPipe) userId: number): Promise<UserDTO> {
    const result = await this.useCase.execute({ userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GetUserErrors.UserDoesntExistError:
          throw new BadRequestException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    const user = result.value.getValue();

    return UserMapper.toDTO(user);
  }
}