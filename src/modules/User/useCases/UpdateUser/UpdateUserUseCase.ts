import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { User } from '../../domain/User';
import { UserId } from '../../domain/UserId';
import { FailedField, UserName } from '../../domain/UserName';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { UpdateUserDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';

type Response = Either<
  UpdateUserErrors.UserDoesntExistError | UpdateUserErrors.InvalidDataError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@Injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserDTO, Promise<Response>> {
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(updateUserDTO: UpdateUserDTO): Promise<Response> {
    const updatedUsernameOrError = UserName.create({ name: updateUserDTO.username });
    const userIdOrError = UserId.create(new UniqueEntityID(updateUserDTO.userId));

    const dtoResult = Result.combine([updatedUsernameOrError, userIdOrError]);

    if (dtoResult.isFailure) {
      return left(new UpdateUserErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const userName = updatedUsernameOrError.getValue() as UserName;
    const userId = userIdOrError.getValue();

    const userWithTheSameUserName = await this.userRepo.getUserByUsername(userName);

    if (userWithTheSameUserName) {
      return left(new UpdateUserErrors.InvalidDataError([new FailedField('username', 'Username already exists')]));
    }

    const searchedUserById = await this.userRepo.getUserByUserId(userId);

    if (!searchedUserById) {
      return left(new UpdateUserErrors.UserDoesntExistError());
    }

    const userOrError = User.create(
      {
        username: userName,
      },
      userId.getValue(),
    );

    if (userOrError.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const user = userOrError.getValue();

    await this.userRepo.save(user);

    return right(Result.ok<void>());
  }
}
