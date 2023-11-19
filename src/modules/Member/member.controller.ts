import { Controller, Post, Inject, Body } from '@nestjs/common';
import { CreateMemberUseCaseSymbol } from './utils/symbols';
import { UseCase } from 'src/shared/core/UseCase';
import { CreateMemberDTO } from './use-cases/createMember/CreateUserDTO';

@Controller('member')
export class MemberController {
  constructor(
    @Inject(CreateMemberUseCaseSymbol)
    private readonly createMemberUseCase: UseCase<CreateMemberDTO, Promise<void>>,
  ) {}

  @Post()
  async createMember(@Body() createMemberDTO: CreateMemberDTO): Promise<void> {
    await this.createMemberUseCase.execute(createMemberDTO);
  }
}
