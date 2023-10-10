import { Module } from '@nestjs/common';
import { IUserService } from './AppModule/Member/user.service';
import { PrismaService } from './prisma.service';
import { UserController } from './AppModule/Member/user.controller';
import { GatheringController } from './AppModule/Gathering/gathering.controller';
import { GatheringService } from './AppModule/Gathering/gathering.service';
import { GatheringRepo } from './AppModule/Gathering/gathering.repo';

@Module({
  imports: [],
  controllers: [UserController, GatheringController],
  providers: [IUserService, PrismaService, GatheringService, GatheringRepo],
})
export class AppModule {}
