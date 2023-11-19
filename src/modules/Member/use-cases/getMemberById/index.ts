import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { IGetMemberByIdUseCase } from './types';
import { MemberRepoSymbol } from '../../utils/symbols';
import { Member } from '../../domain/member';
import { IMemberRepo } from '../../member.repo';
import { MemberId } from '../../domain/memberId';

@Injectable()
export class GetMemberByIdUseCase implements IGetMemberByIdUseCase {
  constructor(
    @Inject(MemberRepoSymbol)
    private readonly memberRepo: IMemberRepo,
  ) {}

  async execute(memberId: MemberId): Promise<Member> {
    return await this.memberRepo.getMemberById(memberId);
  }
}
