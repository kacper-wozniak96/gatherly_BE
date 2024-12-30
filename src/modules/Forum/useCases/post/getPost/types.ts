import { PostDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { GetPostErrors } from './GetPostErrors';

export type ResponseData = Either<AppError.UnexpectedError | GetPostErrors.PostDoesntExistError, Result<PostDTO>>;

export type RequestData = {
  postId: number;
};
