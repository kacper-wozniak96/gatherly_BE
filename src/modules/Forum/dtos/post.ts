import { UserDTO } from 'src/modules/User/dtos/user';

export interface PostDTO {
  id: number;
  title: string;
  text: string;
  user: UserDTO;
  upVotesTotalNumber: number;
  downVotesTotalNumber: number;
  isUpVotedByUser: boolean;
  isDownVotedByUser: boolean;
  createdAt: Date;
  postCommentsTotalNumber: number;
  comments: CommentDTO[];
}

export interface CommentDTO {
  id: number;
  postId: number;
  text: string;
  user: UserDTO;
}
