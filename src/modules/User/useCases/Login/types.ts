import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UserDTO } from '../../dtos/user';
import { LoginUseCaseErrors } from './LoginUserErrors';

export type ResponseData = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
  Result<LoginUserResponse>
>;

export interface LoginUserResponse extends LoginUserResponseDTO {
  accessToken: string;
}

export interface LoginUserResponseDTO {
  user: UserDTO;
}

export type RequestData = {
  dto: LoginUserRequestDTO;
};

export interface LoginUserRequestDTO {
  username: string;
  password: string;
}
