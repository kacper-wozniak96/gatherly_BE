import { AppError } from 'src/shared/core/AppError';
import { Either, Result } from 'src/shared/core/Result';
import { UpVotePostErrors } from './UpVotePostErrors';

export type UpVotePostResponse = Either<UpVotePostErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;
