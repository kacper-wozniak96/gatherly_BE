import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { User } from '../../domain/User';
import { UserConfirmPassword } from '../../domain/UserConfirmPassword';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserErrors } from './CreateUserErrors';

type Response = Either<CreateUserErrors.UsernameTakenError | AppError.UnexpectedError | Result<any>, Result<void>>;

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Response>> {
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(createUserDTO: CreateUserDTO): Promise<Response> {
    const userUsernameOrError = UserName.create({ name: createUserDTO.userName });
    const userPasswordOrError = UserPassword.create({ value: createUserDTO.password });
    const userConfirmPasswordOrError = UserConfirmPassword.create({ value: createUserDTO.confirmPassword });

    const dtoResult = Result.combine([userUsernameOrError, userPasswordOrError, userConfirmPasswordOrError]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue()));
    }

    const userName = userUsernameOrError.getValue();
    const userPassword = userPasswordOrError.getValue();
    const userConfirmPassword = userConfirmPasswordOrError.getValue();

    if (userPassword.value !== userConfirmPassword.value) {
      return left(new CreateUserErrors.PasswordsDoNotMatchError());
    }

    const userWithTheSameUserName = await this.userRepo.getUserByUsername(userName);

    if (userWithTheSameUserName) {
      return left(new CreateUserErrors.UsernameTakenError());
    }

    const userOrError = User.create({
      username: userName,
      password: userPassword,
    });

    if (userOrError.isFailure) {
      return left(Result.fail<User>(userOrError.getErrorValue().toString()));
    }

    const user = userOrError.getValue();

    await this.userRepo.save(user);

    return right(Result.ok<void>());
  }
}
