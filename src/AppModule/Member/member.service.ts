import { Inject, Injectable } from '@nestjs/common';
import { IMemberRepo, IMemberService } from './utils/types';
import { MemberRepoSymbol } from './utils/symbols';

@Injectable()
export class MemberService implements IMemberService {
  constructor(
    @Inject(MemberRepoSymbol) private readonly memberRepo: IMemberRepo,
  ) {}

  async getMemberById(memberId: number): Promise<any> {
    return await this.memberRepo.getMemberById(memberId);
  }
}
