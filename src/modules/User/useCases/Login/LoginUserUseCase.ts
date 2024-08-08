import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from 'src/modules/AuthModule/Auth.service';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { User } from '../../domain/user';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { LoginUserDTO, LoginUserResponseDTO } from './LoginUserDTO';
import { LoginUseCaseErrors } from './LoginUserErrors';

type Response = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
  Result<LoginUserResponseDTO>
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

    const usernameOrError = UserName.create({ name: request.username });
    const passwordOrError = UserPassword.create({ value: request.password });

    const payloadResult = Result.combine([usernameOrError, passwordOrError]);

    if (payloadResult.isFailure) {
      return left(Result.fail<any>(payloadResult.getErrorValue()));
    }

    username = usernameOrError.getValue();
    password = passwordOrError.getValue();

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
      Result.ok<LoginUserResponseDTO>({
        accessToken,
      }),
    );
  }
}
