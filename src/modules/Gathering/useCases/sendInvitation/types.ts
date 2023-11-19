import { MemberId } from 'src/modules/Member/domain/memberId';
import { GatheringId } from '../../domain/gatheringId';

export interface ISendInvitationUseCase {
  execute(gatheringId: GatheringId, memberId: MemberId): Promise<void>;
}
