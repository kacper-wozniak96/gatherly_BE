import { Post } from 'src/modules/Forum/domain/post';

export interface CreatePostDTO {
  title: string;
  description: string;
}

// export interface ICreatePost {
//   userId: number;
//   title: string;
//   description: string;
// }

export interface CreatePostResponseDTO {
  post: Post;
}
