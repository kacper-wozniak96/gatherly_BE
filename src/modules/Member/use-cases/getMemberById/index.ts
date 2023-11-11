import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { IGetMemberByIdUseCase } from './types';
import { IMemberRepo } from '../../utils/types';
import { MemberRepoSymbol } from '../../utils/symbols';
import { Member } from '../../domain/member';

@Injectable()
export class GetMemberByIdUseCase implements IGetMemberByIdUseCase {
  constructor(
    @Inject(MemberRepoSymbol)
    private readonly memberRepo: IMemberRepo,
  ) {}

  async execute(memberId: number): Promise<Member> {
    return await this.memberRepo.getMemberById(memberId);
  }
}
