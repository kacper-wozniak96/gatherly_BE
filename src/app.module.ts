import { Module, Type } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateMemberUseCaseSymbol, GetMemberByIdUseCaseSymbol, MemberRepoSymbol } from './modules/Member/utils/symbols';
import { CreateMemberUseCase } from './modules/Member/use-cases/createMember/CreateMemberUseCase';
import {
  CreateGatheringUseCaseSymbol,
  GatheringRepoSymbol,
  GetGatheringByIdUseCaseSymbol,
} from './modules/Gathering/utils/Symbols/Gathering';
import { GatheringRepo } from './modules/Gathering/repos/gathering.repo';
import { CreateGatheringUseCase } from './modules/Gathering/useCases/createGathering';
import { GetGatheringByIdUseCase } from './modules/Gathering/useCases/getGatheringById';
import { InvitationRepoSymbol, SendInvitationUseCaseSymbol } from './modules/Gathering/utils/Symbols/Invitation';
import { SendInvitationUseCase } from './modules/Gathering/useCases/sendInvitation';
import { InvitationRepo } from './modules/Gathering/repos/invitation.repo';
import { MemberRepo } from './modules/Member/member.repo';
import { GatheringController } from './modules/Gathering/infra/http/gathering.controller';
import { InvitationController } from './modules/Gathering/infra/http/invitation.controller';
import { GetMemberByIdUseCase } from './modules/Member/use-cases/getMemberById';

export class Provider {
  provide: any;
  useClass: Type;

  constructor(provide: any, useClass: Type) {
    this.provide = provide;
    this.useClass = useClass;
  }
}

@Module({
  imports: [],
  controllers: [GatheringController, InvitationController],
  providers: [
    PrismaService,
    // new Provider(GatheringServiceSymbol, GatheringService),
    // new Provider(CreateGatheringUseCaseSymbol, CreateGatheringUseCase),
    // new Provider(GatheringRepoSymbol, GatheringRepo),
    // new Provider(GatheringControllerSymbol, GatheringController),

    // ...GatheringProviders,
    // ...InvitationProviders,
    // ...MemberProviders,

    // new Provider(MemberServiceSymbol, MemberService),
    // new Provider(InvitationServiceSymbol, InvitationService),

    new Provider(GatheringRepoSymbol, GatheringRepo),
    new Provider(CreateGatheringUseCaseSymbol, CreateGatheringUseCase),
    new Provider(GetGatheringByIdUseCaseSymbol, GetGatheringByIdUseCase),

    new Provider(SendInvitationUseCaseSymbol, SendInvitationUseCase),
    new Provider(InvitationRepoSymbol, InvitationRepo),

    new Provider(CreateMemberUseCaseSymbol, CreateMemberUseCase),
    new Provider(GetMemberByIdUseCaseSymbol, GetMemberByIdUseCase),
    new Provider(MemberRepoSymbol, MemberRepo),
  ],
})
export class AppModule {}
