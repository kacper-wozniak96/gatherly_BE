import { GetPostsResponseDTO } from 'gatherly-types';
import { AppError } from 'src/shared/core/AppError';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';

// export interface GetPostsResponseDTO {
//   posts: PostDTO[];
//   postsTotalCount: number;
// }

export type ResponseData = Either<AppError.UnexpectedError, Result<GetPostsResponseDTO>>;

export type RequestData = {
  offset: number;
  search: string;
};
