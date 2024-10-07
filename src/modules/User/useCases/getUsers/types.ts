import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UserDTO } from '../../dtos/user';

export type ResponseData = Either<AppError.UnexpectedError, Result<UserDTO[]>>;
