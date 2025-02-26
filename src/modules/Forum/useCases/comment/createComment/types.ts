import { CreateCommentRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { CreateCommentErrors } from './CreateCommentErrors';

export type ResponseData = Either<CreateCommentErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

export type RequestData = {
  postId: number;
  dto: CreateCommentRequestDTO;
};
