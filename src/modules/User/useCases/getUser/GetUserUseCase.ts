import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { User } from '../../domain/User';
import { UserId } from '../../domain/UserId';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { GetUserRequestDTO } from './GetUserDTO';
import { GetUserErrors } from './GetUserErrors';

type Response = Either<GetUserErrors.UserDoesntExistError | AppError.UnexpectedError, Result<User>>;

@Injectable()
export class GetUserUseCase implements UseCase<GetUserRequestDTO, Promise<Response>> {
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(getUserDTO: GetUserRequestDTO): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(getUserDTO.userId));

    const dtoResult = Result.combine([userIdOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const userId = userIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new GetUserErrors.UserDoesntExistError());

    return right(Result.ok<User>(user));
  }
}
