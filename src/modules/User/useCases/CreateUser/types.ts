import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { CreateUserErrors } from './CreateUserErrors';

export type ResponseData = Either<CreateUserErrors.UsernameTakenError | AppError.UnexpectedError | Result<any>, Result<void>>;

export type RequestData = {
  dto: CreateUserDTO;
};

export interface CreateUserDTO {
  username: string;
  password: string;
  confirmPassword: string;
}
