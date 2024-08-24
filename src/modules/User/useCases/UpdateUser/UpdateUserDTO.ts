export interface UpdateUserRequestDTO {
  username: string;
}

export interface UpdateUserDTO {
  username?: string;
  userId: number;
  file?: Express.Multer.File;
}
