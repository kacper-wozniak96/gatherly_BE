import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { DownVotePostErrors } from './DownVotePostErrors';

export type ResponseData = Either<DownVotePostErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

export type RequestData = {
  postId: number;
};
