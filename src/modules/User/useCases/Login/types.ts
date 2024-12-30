import { LoginUserRequestDTO, LoginUserResponseDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { LoginUseCaseErrors } from './LoginUserErrors';

export type ResponseData = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
  Result<LoginUserResponse>
>;

export interface LoginUserResponse extends LoginUserResponseDTO {
  accessToken: string;
}

export type RequestData = {
  dto: LoginUserRequestDTO;
};
