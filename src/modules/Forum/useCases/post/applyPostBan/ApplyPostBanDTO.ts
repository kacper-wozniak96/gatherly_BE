export interface ApplyPostBanRequestDTO {
  postTypeOfBan: EBanType;
  bannedUserId: number;
}

export interface ApplyPostBanUseCaseData {
  postId: number;
  dto: ApplyPostBanRequestDTO;
}

export enum EBanType {
  viewingPost = 1,
  addingComments,
  downVotingAndUpVoting,
}
