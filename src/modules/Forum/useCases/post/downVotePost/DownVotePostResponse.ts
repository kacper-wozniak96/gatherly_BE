import { AppError } from 'src/shared/core/AppError';
import { Either, Result } from 'src/shared/core/Result';
import { DownVotePostErrors } from './DownVotePostErrors';

export type DownVotePostResponse = Either<DownVotePostErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;
