import { Module, Type } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GatheringController } from './AppModule/Gathering/gathering.controller';
import { GatheringService } from './AppModule/Gathering/gathering.service';
import { GatheringRepo } from './AppModule/Gathering/gathering.repo';
import {
  GatheringControllerSymbol,
  GatheringRepoSymbol,
  GatheringServiceSymbol,
} from './AppModule/Gathering/utils/symbols';
import { MemberService } from './AppModule/Member/member.service';
import {
  MemberRepoSymbol,
  MemberServiceSymbol,
} from './AppModule/Member/utils/symbols';
import { MemberRepo } from './AppModule/Member/member.repo';
import { InvitationController } from './AppModule/Invitation/invitation.controller';

class Provider {
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
    new Provider(GatheringServiceSymbol, GatheringService),
    new Provider(GatheringRepoSymbol, GatheringRepo),
    new Provider(GatheringControllerSymbol, GatheringController),
    new Provider(MemberServiceSymbol, MemberService),
    new Provider(MemberRepoSymbol, MemberRepo),
  ],
})
export class AppModule {}
