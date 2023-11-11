export interface ISendInvitationUseCase {
  execute(gatheringId: number, memberId: number): Promise<void>;
}
