import { UserDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';

export type ResponseData = Either<AppError.UnexpectedError, Result<UserDTO[]>>;
