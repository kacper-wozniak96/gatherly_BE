import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { DeletePostErrors } from './DeletePostErrors';

export type ResponseData = Either<DeletePostErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

export type RequestData = {
  postId: number;
};
