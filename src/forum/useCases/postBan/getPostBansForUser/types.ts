import { PostBanDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { GetPostBansErrors } from './GetPostBansForUserErrors';

export type ResponseData = Either<
  | AppError.UnexpectedError
  | GetPostBansErrors.UserDoesntExistError
  | GetPostBansErrors.PostDoesntExistError
  | GetPostBansErrors.UserDoesntOwnPostError,
  Result<PostBanDTO[]>
>;

export type RequestData = {
  searchedUserId: number;
  postId: number;
};
