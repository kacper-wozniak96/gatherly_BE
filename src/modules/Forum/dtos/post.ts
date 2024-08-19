import { UserDTO } from 'src/modules/User/dtos/user';

export interface PostDTO {
  id: number;
  title: string;
  text: string;
  user: UserDTO;
  upVotesTotal: number;
  downVotesTotal: number;
  isUpVotedByUser: boolean;
  isDownVotedByUser: boolean;
}
