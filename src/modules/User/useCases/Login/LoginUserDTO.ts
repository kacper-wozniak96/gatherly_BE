import { UserDTO } from '../../dtos/user';

export interface LoginUserDTO {
  username: string;
  password: string;
}

export interface LoginUserResponse {
  accessToken: string;
  user: UserDTO;
}

export interface LoginUserResponseDTO {
  user: UserDTO;
}
