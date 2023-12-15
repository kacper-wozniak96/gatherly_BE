import { Module, Type } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
import { PostRepoSymbol } from './modules/Forum/repos/utils/symbols';
import { PostRepo } from './modules/Forum/repos/implementations/postRepo';
import { CreatePostUseCaseSymbol } from './modules/Forum/useCases/post/utils/symbols';
import { CreatePostUseCase } from './modules/Forum/useCases/post/createPost/CreatePost';
import { CreatePostController } from './modules/Forum/useCases/post/createPost/CreatePostController';
import { UserCreateController } from './modules/User/useCases/CreateUser/CreateUserController';
import { UserRepo } from './modules/User/repos/implementations/userRepo';
import { CreateUserUseCaseSymbol, LoginUserUseCaseSymbol } from './modules/User/utils/symbols';
import { CreateUserUseCase } from './modules/User/useCases/CreateUser/CreateUserUseCase';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/AuthModule/Auth.guard';
import { LoginUserController } from './modules/User/useCases/Login/LoginUserController';
import { LoginUserUseCase } from './modules/User/useCases/Login/LoginUserUseCase';
import { UserRepoSymbol } from './modules/User/repos/utils/symbols';
import { AuthService } from './modules/AuthModule/Auth.service';

export class Provider {
  provide: any;
  useClass: Type;

  constructor(provide: any, useClass: Type) {
    this.provide = provide;
    this.useClass = useClass;
  }
}

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'adasdasdad',
      signOptions: { expiresIn: '30 days' },
    }),
  ],
  controllers: [GatheringController, InvitationController, CreatePostController, UserCreateController, LoginUserController],
  providers: [
    PrismaService,
    JwtService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

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

    new Provider(PostRepoSymbol, PostRepo),
    new Provider(UserRepoSymbol, UserRepo),
    new Provider(CreatePostUseCaseSymbol, CreatePostUseCase),

    new Provider(CreateUserUseCaseSymbol, CreateUserUseCase),
    new Provider(LoginUserUseCaseSymbol, LoginUserUseCase),
  ],
})
export class AppModule {}
