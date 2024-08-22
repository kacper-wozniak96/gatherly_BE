import { Body, Controller, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BASE_USER_CONTROLLER_PATH } from '../../utils/baseContollerPath';
import { UpdateUserUseCaseSymbol } from '../../utils/symbols';
import { UpdateUserRequestDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';
import { UpdateUserUseCase } from './UpdateUserUseCase';

@Controller(BASE_USER_CONTROLLER_PATH)
export class UpdateUserController {
  constructor(@Inject(UpdateUserUseCaseSymbol) private readonly useCase: UpdateUserUseCase) {}

  @Patch('/:id')
  async updateUser(@Param('id', ParseIntPipe) userId: number, @Body() updateUserDTO: UpdateUserRequestDTO): Promise<void> {
    const result = await this.useCase.execute({ ...updateUserDTO, userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UpdateUserErrors.UserDoesntExistError:
          throw new NotFoundException(error.getErrorValue());
        default:
          throw new InternalServerErrorException(error.getErrorValue());
      }
    }

    return;
  }
}
