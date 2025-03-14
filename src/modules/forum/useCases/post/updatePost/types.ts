import { UpdatePostRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UpdatePostErrors } from './UpdatePostErrors';

export type ResponseData = Either<
  | UpdatePostErrors.PostDoesntExistError
  | UpdatePostErrors.UserDoesntExistError
  | UpdatePostErrors.InvalidDataError
  | AppError.UnexpectedError,
  Result<void>
>;

export type RequestData = {
  dto: UpdatePostRequestDTO;
  postId: number;
};
