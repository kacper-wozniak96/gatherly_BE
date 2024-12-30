import { UpdateUserRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UpdateUserErrors } from './UpdateUserErrors';

export type ResponseData = Either<
  UpdateUserErrors.UserDoesntExistError | UpdateUserErrors.InvalidDataError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

export type RequestData = {
  dto: UpdateUserRequestDTO;
  userId: number;
  file: Express.Multer.File;
};
