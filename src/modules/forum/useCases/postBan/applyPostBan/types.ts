import { ApplyPostBanRequestDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { ApplyPostBanErrors } from './ApplyPostBanErrors';

export type ResponseData = Either<
  ApplyPostBanErrors.UserDoesntExistError | ApplyPostBanErrors.PostDoesntExistError | AppError.UnexpectedError | Result<void>,
  Result<void>
>;

export type RequestData = {
  postId: number;
  bannedUserId: number;
  dto: ApplyPostBanRequestDTO;
};
