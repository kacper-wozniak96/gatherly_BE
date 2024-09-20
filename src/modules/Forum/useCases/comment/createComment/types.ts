import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { CreateCommentErrors } from './CreateCommentErrors';

export interface CreateCommentRequestDTO {
  comment: string;
}

export type ResponseData = Either<CreateCommentErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

export type RequestData = {
  postId: number;
  dto: CreateCommentRequestDTO;
};
