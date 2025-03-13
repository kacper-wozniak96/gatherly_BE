import { CreatePostRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { CreatePostErrors } from './CreatePostErrors';

export type ResponseData = Either<CreatePostErrors.UserDoesntExistError | AppError.UnexpectedError, Result<void>>;

export type RequestData = {
  dto: CreatePostRequestDTO;
};
