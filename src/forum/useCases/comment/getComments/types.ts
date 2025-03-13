import { CommentDTO } from 'src/forum/dtos/post';
import { Either } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { GetCommentsErrors } from './GetCommentsErrors';

export interface GetCommentsRequestDTO {
  postId: number;
  offset: number;
}

export interface GetCommentsResponseDTO {
  comments: CommentDTO[];
  commentsTotalCount: number;
}

export type ResponseData = Either<GetCommentsErrors.PostDoesntExistError, Result<GetCommentsResponseDTO>>;

export type RequestData = {
  postId: number;
  offset: number;
};
