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
  postCommentTotalNumber: number;
}
