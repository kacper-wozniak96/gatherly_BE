import { Inject, Injectable } from '@nestjs/common';

import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { User } from '../../domain/User';
import { UserConfirmPassword } from '../../domain/UserConfirmPassword';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { CreateUserErrors } from './CreateUserErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class CreateUserUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const userUsernameOrError = UserName.create({ value: requestData.dto.username });
    const userPasswordOrError = UserPassword.create({ value: requestData.dto.password });
    const userConfirmPasswordOrError = UserConfirmPassword.create({ value: requestData.dto.confirmPassword });

    const dtoResult = Result.combine([userUsernameOrError, userPasswordOrError, userConfirmPasswordOrError]);

    if (dtoResult.isFailure) {
      return left(new CreateUserErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const userName = (userUsernameOrError as Result<UserName>).getValue();
    const userPassword = (userPasswordOrError as Result<UserPassword>).getValue();
    const userConfirmPassword = userConfirmPasswordOrError.getValue();

    if (!userPassword.equals(userConfirmPassword)) {
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
      return left(Result.fail<User>(userOrError.getErrorValue()));
    }

    const user = userOrError.getValue();

    await this.userRepo.save(user);

    return right(Result.ok<void>());
  }
}
