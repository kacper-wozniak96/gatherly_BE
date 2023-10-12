import { Module } from '@nestjs/common';
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

// class Provider {
//   provide: any;
//   useClass: Type;

//   constructor(provide: any, useClass: Type) {
//     this.provide = provide;
//     this.useClass = useClass;
//   }
// }
// new Provider(GatheringServiceSymbol, GatheringService),
// new Provider(GatheringRepoSymbol, GatheringRepo),
// new Provider(GatheringControllerSymbol, GatheringController),
// new Provider(MemberServiceSymbol, MemberService),
// new Provider(MemberRepoSymbol, MemberRepo),

@Module({
  imports: [],
  controllers: [GatheringController],
  providers: [
    PrismaService,
    {
      provide: GatheringServiceSymbol,
      useClass: GatheringService,
    },
    {
      provide: GatheringRepoSymbol,
      useClass: GatheringRepo,
    },
    {
      provide: GatheringControllerSymbol,
      useClass: GatheringController,
    },
    {
      provide: MemberServiceSymbol,
      useClass: MemberService,
    },
    {
      provide: MemberRepoSymbol,
      useClass: MemberRepo,
    },
  ],
})
export class AppModule {}
