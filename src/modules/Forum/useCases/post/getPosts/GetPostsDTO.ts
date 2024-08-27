import { PostDTO } from 'src/modules/Forum/dtos/post';

export interface GetPostsUseCaseData {
  offset: number;
}

export interface GetPostsResponseDTO {
  posts: PostDTO[];
  postsTotalCount: number;
}
