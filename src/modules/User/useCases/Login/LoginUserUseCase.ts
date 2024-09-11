import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from 'src/modules/AuthModule/Auth.service';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { User } from '../../domain/User';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { LoginUserDTO, LoginUserResponse } from './LoginUserDTO';
import { LoginUseCaseErrors } from './LoginUserErrors';

type Response = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
  Result<LoginUserResponse>
>;

@Injectable()
export class LoginUserUseCase implements UseCase<LoginUserDTO, Promise<Response>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    private readonly authService: AuthService,
  ) {}

  async execute(request: LoginUserDTO): Promise<Response> {
    let user: User;
    let username: UserName;
    let password: UserPassword;

    const usernameOrError = UserName.create({ value: request.username });
    const passwordOrError = UserPassword.create({ value: request.password });

    const payloadResult = Result.combine([usernameOrError, passwordOrError]);

    if (payloadResult.isFailure) {
      // return left(Result.fail<any>(payloadResult.getErrorValue()));
      // throw new HttpException(payloadResult.getErrorValue(), HttpStatus.BAD_REQUEST);
      return left(new LoginUseCaseErrors.InvalidDataError());
    }

    username = (usernameOrError as Result<UserName>).getValue();
    password = (passwordOrError as Result<UserPassword>).getValue();
    // password = passwordOrError.getValue();

    user = await this.userRepo.getUserByUsername(username);
    const userFound = !!user;

    if (!userFound) {
      return left(new LoginUseCaseErrors.UserNameDoesntExistError());
    }

    const passwordValid = await user.props.password.comparePassword(password.value);

    if (!passwordValid) {
      return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
    }

    const accessToken = await this.authService.signJWT(user.id.toValue() as number);

    return right(
      Result.ok<LoginUserResponse>({
        accessToken,
        user: UserMapper.toDTO(user),
      }),
    );
  }
}
