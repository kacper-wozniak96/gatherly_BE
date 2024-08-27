import { CommentDTO } from 'src/modules/Forum/dtos/post';

export interface GetCommentsRequestDTO {
  postId: number;
  offset: number;
}

export interface GetCommentsResponseDTO {
  comments: CommentDTO[];
  commentsTotalCount: number;
}
