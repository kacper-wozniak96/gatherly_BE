export interface IAcceptInvitationUseCase {
  execute(invitationId: number): Promise<void>;
}
