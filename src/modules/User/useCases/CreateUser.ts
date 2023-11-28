import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { UserRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { CreateUserDTO } from './CreateUserDTO';
import { UserUsername } from '../domain/userUsername';
import { UserPassword } from '../domain/userPassword';
import { UserConfirmPassword } from '../domain/userConfirmPassword';
import { CreateUserErrors } from './CreateUserErrors';
import { IUserRepo } from '../repos/userRepo';
import { User } from '../domain/user';

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Result<void>>> {
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(createUserDTO: CreateUserDTO): Promise<Result<void>> {
    const userUsernameOrError = UserUsername.create({ value: createUserDTO.userName });
    const userPasswordOrError = UserPassword.create({ value: createUserDTO.password });
    const userConfirmPasswordOrError = UserConfirmPassword.create({ value: createUserDTO.confirmPassword });

    const failedResults = Result.returnFailedResults([userUsernameOrError, userPasswordOrError, userConfirmPasswordOrError]);

    if (failedResults?.length) {
      throw new ForbiddenException(new CreateUserErrors.ValueObjectValidationError(Result.returnErrorValuesFromResults(failedResults)));
    }

    const userUsername = userUsernameOrError.getSuccessValue();
    const userPassword = userPasswordOrError.getSuccessValue();
    const userConfirmPassword = userConfirmPasswordOrError.getSuccessValue();

    if (userPassword.value !== userConfirmPassword.value) {
      throw new ForbiddenException(new CreateUserErrors.PasswordsDoNotMatchError());
    }

    const userWithTheSameUsername = await this.userRepo.getUserByUsername(userUsername);

    if (userWithTheSameUsername) {
      throw new ForbiddenException(new CreateUserErrors.UsernameTakenError());
    }

    const userOrError = User.create({
      username: userUsername,
      password: userPassword,
    });

    if (userOrError.isFailure) {
      throw new ForbiddenException(new CreateUserErrors.UserCreationError());
    }

    const user = userOrError.getSuccessValue();

    await this.userRepo.save(user);

    return Result.ok<void>();
  }
}
