import { UserDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { GetUserErrors } from './GetUserErrors';

export type ResponseData = Either<GetUserErrors.UserDoesntExistError | AppError.UnexpectedError, Result<UserDTO>>;

export type RequestData = {
  userId: number;
};
