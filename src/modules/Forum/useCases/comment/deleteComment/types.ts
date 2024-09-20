import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { DeleteCommentErrors } from './DeleteCommentErrors';

export interface DeleteCommentUseCaseData {
  postId: number;
  commentId: number;
}

export type ResponseData = Either<DeleteCommentErrors.UserDoesntExistError | AppError.UnexpectedError, Result<void>>;

export type RequestData = {
  postId: number;
  commentId: number;
};
