export interface ApplyPostBanRequestDTO {
  bansChanges: Record<EBanType, boolean>;
}

export interface ApplyPostBanUseCaseData {
  postId: number;
  bannedUserId: number;
  dto: ApplyPostBanRequestDTO;
}

export enum EBanType {
  viewingPost = 1,
  addingComments,
  downVotingAndUpVoting,
}
