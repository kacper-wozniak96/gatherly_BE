import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { CreatePostErrors } from './CreatePostErrors';

export interface CreatePostRequestDTO {
  title: string;
  text: string;
}

export type ResponseData = Either<CreatePostErrors.UserDoesntExistError | AppError.UnexpectedError, Result<void>>;

export type RequestData = {
  dto: CreatePostRequestDTO;
};
