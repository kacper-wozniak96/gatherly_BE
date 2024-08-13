import { MiddlewareConsumer, Module, RequestMethod, Type } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './modules/AuthModule/Auth.guard';
import { AuthService } from './modules/AuthModule/Auth.service';
import { JwtStrategy } from './modules/AuthModule/strategies/jwt.strategy';
import { PostService } from './modules/Forum/domain/services/PostService';
import { PostRepo } from './modules/Forum/repos/implementations/postRepo';
import { PostVoteRepo } from './modules/Forum/repos/implementations/postVoteRepo';
import { PostRepoSymbol, PostVoteRepoSymbol } from './modules/Forum/repos/utils/symbols';
import { CreatePostUseCase } from './modules/Forum/useCases/post/createPost/CreatePost';
import { CreatePostController } from './modules/Forum/useCases/post/createPost/CreatePostController';
import { GetPostsController } from './modules/Forum/useCases/post/getPosts/GetPostsController';
import { GetPostsUseCase } from './modules/Forum/useCases/post/getPosts/GetPostsUseCase';
import { UpVotePostController } from './modules/Forum/useCases/post/upVotePost/UpVotePostController';
import { UpVotePostUseCase } from './modules/Forum/useCases/post/upVotePost/UpVotePostUseCase';
import { CreatePostUseCaseSymbol, GetPostsUseCaseSymbol, UpVotePostUseCaseSymbol } from './modules/Forum/useCases/post/utils/symbols';
import { LoggerMiddleware } from './modules/Logger/logger';
import { UserRepo } from './modules/User/repos/implementations/userRepo';
import { UserRepoSymbol } from './modules/User/repos/utils/symbols';
import { UserCreateController } from './modules/User/useCases/CreateUser/CreateUserController';
import { CreateUserUseCase } from './modules/User/useCases/CreateUser/CreateUserUseCase';
import { LoginUserController } from './modules/User/useCases/Login/LoginUserController';
import { LoginUserUseCase } from './modules/User/useCases/Login/LoginUserUseCase';
import { CreateUserUseCaseSymbol, LoginUserUseCaseSymbol } from './modules/User/utils/symbols';
import { PrismaService } from './prisma.service';

class Provider {
  provide: symbol;
  useClass: Type;

  constructor(provide: symbol, useClass: Type) {
    this.provide = provide;
    this.useClass = useClass;
  }
}

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '30 days' },
    }),
  ],
  controllers: [CreatePostController, UserCreateController, LoginUserController, GetPostsController, UpVotePostController],
  providers: [
    PrismaService,
    JwtService,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    new Provider(PostRepoSymbol, PostRepo),
    new Provider(UserRepoSymbol, UserRepo),
    new Provider(CreatePostUseCaseSymbol, CreatePostUseCase),

    new Provider(CreateUserUseCaseSymbol, CreateUserUseCase),
    new Provider(LoginUserUseCaseSymbol, LoginUserUseCase),
    new Provider(GetPostsUseCaseSymbol, GetPostsUseCase),
    new Provider(PostVoteRepoSymbol, PostVoteRepo),
    new Provider(UpVotePostUseCaseSymbol, UpVotePostUseCase),
    PostService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
