import { UserDTO } from '../../dtos/user';

export interface LoginUserDTO {
  username: string;
  password: string;
}

export interface LoginUserResponseDTO {
  accessToken: string;
  user: UserDTO;
}
