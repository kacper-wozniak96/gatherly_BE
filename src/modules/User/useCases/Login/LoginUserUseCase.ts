import { Injectable, Inject, ForbiddenException } from '@nestjs/common';

import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { UserUsername } from '../../domain/userUsername';
import { LoginUserDTO, LoginUserResponseDTO } from './LoginUserDTO';
import { UserPassword } from '../../domain/userPassword';
import { Result } from 'src/shared/core/Result';
import { LoginUserErrors } from './LoginUserErrors';
import { UseCase } from 'src/shared/core/UseCase';
import { AuthService } from 'src/modules/AuthModule/Auth.service';

@Injectable()
export class LoginUserUseCase implements UseCase<LoginUserDTO, Promise<LoginUserResponseDTO | void>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    private readonly authService: AuthService,
  ) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<LoginUserResponseDTO | void> {
    const userUsernameOrError = UserUsername.create({ value: loginUserDTO.username });
    const userPasswordOrError = UserPassword.create({ value: loginUserDTO.password });

    const failedResults = Result.returnFailedResults([userUsernameOrError, userPasswordOrError]);

    if (failedResults?.length) {
      throw new ForbiddenException(new LoginUserErrors.ValueObjectValidationError(Result.returnErrorValuesFromResults(failedResults)));
    }

    const userUsername = userUsernameOrError.getSuccessValue();
    const userPassword = userPasswordOrError.getSuccessValue();

    const user = await this.userRepo.getUserByUsername(userUsername, true);

    if (!user) throw new ForbiddenException(new LoginUserErrors.UserDoesNotExistError());

    if (!user.props.password.comparePassword(userPassword.value)) {
      throw new ForbiddenException(new LoginUserErrors.PasswordsDontMatch());
    }

    console.log({ user });

    const accessToken = await this.authService.signJWT(user.id.toValue() as number);

    return { accessToken };
  }
}
