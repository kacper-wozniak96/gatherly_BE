export interface UpdatePostRequestDTO {
  title?: string;
  text?: string;
}

export interface UpdatePostUseCaseData {
  title?: string;
  text?: string;
  postId: number;
}
