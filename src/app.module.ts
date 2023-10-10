import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GatheringController } from './AppModule/Gathering/gathering.controller';
import { GatheringService } from './AppModule/Gathering/gathering.service';
import { GatheringRepo } from './AppModule/Gathering/gathering.repo';
import {
  IGatheringControllerSymbol,
  IGatheringRepoSymbol,
  IGatheringServiceSymbol,
} from './AppModule/Gathering/Core/symbols';

@Module({
  imports: [],
  controllers: [GatheringController],
  providers: [
    PrismaService,
    {
      provide: IGatheringServiceSymbol,
      useClass: GatheringService,
    },
    {
      provide: IGatheringRepoSymbol,
      useClass: GatheringRepo,
    },
    {
      provide: IGatheringControllerSymbol,
      useClass: GatheringController,
    },
  ],
})
export class AppModule {}
