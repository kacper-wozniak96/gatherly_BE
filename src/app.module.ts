import { Module, Type } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GatheringController } from './AppModule/Gathering/gathering.controller';
import {
  CreateGatheringUseCaseSymbol,
  GatheringRepoSymbol,
  GetGatheringByIdUseCaseSymbol,
} from './AppModule/Gathering/utils/symbols';
import { InvitationController } from './AppModule/Invitation/invitation.controller';
import { GatheringRepo } from './AppModule/Gathering/gathering.repo';
import { CreateGatheringUseCase } from './AppModule/Gathering/use-cases/createGathering';
import { GetGatheringByIdUseCase } from './AppModule/Gathering/use-cases/getGatheringById';
import {
  InvitationRepoSymbol,
  SendInvitationUseCaseSymbol,
} from './AppModule/Invitation/utils/symbols';
import { SendInvitationUseCase } from './AppModule/Invitation/use-cases/sendInvitation';
import { InvitationRepo } from './AppModule/Invitation/invitation.repo';
import {
  GetMemberByIdUseCaseSymbol,
  MemberRepoSymbol,
} from './AppModule/Member/utils/symbols';
import { GetMemberByIdUseCase } from './AppModule/Member/use-cases/getMemberById';
import { MemberRepo } from './AppModule/Member/member.repo';

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

    new Provider(GetMemberByIdUseCaseSymbol, GetMemberByIdUseCase),
    new Provider(MemberRepoSymbol, MemberRepo),
  ],
})
export class AppModule {}
