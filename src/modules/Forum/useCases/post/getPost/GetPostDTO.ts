import { PostDTO } from 'src/modules/Forum/dtos/post';

export interface GetPostDTO {
  postId: number;
}

export interface GetPostResponseDTO {
  post: PostDTO;
}
