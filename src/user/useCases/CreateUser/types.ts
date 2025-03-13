import { CreateUserRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { CreateUserErrors } from './CreateUserErrors';

export type ResponseData = Either<
  | CreateUserErrors.UsernameTakenError
  | CreateUserErrors.PasswordsDoNotMatchError
  | CreateUserErrors.InvalidDataError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export type RequestData = {
  dto: CreateUserRequestDTO;
};
