import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from 'src/modules/AuthModule/Auth.service';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { LoginUseCaseErrors } from './LoginUserErrors';
import { LoginUserResponse, RequestData, ResponseData } from './types';

@Injectable()
export class LoginUserUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    private readonly authService: AuthService,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const usernameOrError = UserName.create({ value: requestData.dto.username });
    const passwordOrError = UserPassword.create({ value: requestData.dto.password });

    const payloadResult = Result.combine([usernameOrError, passwordOrError]);

    if (payloadResult.isFailure) {
      return left(new LoginUseCaseErrors.InvalidDataError());
    }

    const username = usernameOrError.getValue() as UserName;

    const user = await this.userRepo.getUserByUsername(username);
    const userFound = !!user;

    if (!userFound) {
      return left(new LoginUseCaseErrors.UserNameDoesntExistError());
    }

    if (!user.isGuest()) {
      const passwordValid = user.props.password.comparePassword(requestData.dto.password);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
      }
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
