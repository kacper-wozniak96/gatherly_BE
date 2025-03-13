import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, RequestMethod, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ForumModule } from './forum/forum.module';
import { LoggerMiddleware } from './modules/Logger/logger';
import { EQueues } from './shared/enums/Queues';
import { UserModule } from './user/user.module';

// class Provider {
//   provide: symbol;
//   useClass: Type;

//   constructor(provide: symbol, useClass: Type) {
//     this.provide = provide;
//     this.useClass = useClass;
//   }
// }

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '30 days' },
    }),
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_IP,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: EQueues.reports,
    }),
    ForumModule,
    UserModule,
  ],
  controllers: [
    // TestController,
    // LogoutUserController,
    // CreatePostController,
    // UserCreateController,
    // LoginUserController,
    // GetPostsController,
    // UpVotePostController,
    // DownVotePostController,
    // GetPostController,
    // CreateCommentController,
    // GetUserController,
    // GenerateUserActivityReportController,
    // UpdateUserController,
    // GetCommentsController,
    // DeleteCommentController,
    // DeletePostController,
    // UpdatePostController,
    // GetUsersController,
    // ApplyPostBanController,
    // GetPostBansForUserController,
  ],
  providers: [
    // PrismaService,
    // JwtService,
    // AuthService,
    // JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // new Provider(PostRepoSymbol, PostRepo),
    // new Provider(UserRepoSymbol, UserRepo),
    // new Provider(CreatePostUseCaseSymbol, CreatePostUseCase),
    // new Provider(CreateUserUseCaseSymbol, CreateUserUseCase),
    // new Provider(LoginUserUseCaseSymbol, LoginUserUseCase),
    // new Provider(GetPostsUseCaseSymbol, GetPostsUseCase),
    // new Provider(PostVoteRepoSymbol, PostVoteRepo),
    // new Provider(UpVotePostUseCaseSymbol, UpVotePostUseCase),
    // new Provider(DownVotePostUseCaseSymbol, DownVotePostUseCase),
    // new Provider(GetPostUseCaseSymbol, GetPostUseCase),
    // new Provider(CommentRepoSymbol, CommentRepo),
    // new Provider(CreateCommentUseCaseSymbol, CreateCommentUseCase),
    // new Provider(GetUserUseCaseSymbol, GetUserUseCase),
    // new Provider(UpdateUserUseCaseSymbol, UpdateUserUseCase),
    // new Provider(AwsS3ServiceSymbol, AwsS3Service),
    // new Provider(GetCommentsUseCaseSymbol, GetCommentsUseCase),
    // new Provider(DeleteCommentUseCaseSymbol, DeleteCommentUseCase),
    // new Provider(DeletePostUseCaseSymbol, DeletePostUseCase),
    // new Provider(UpdatePostUseCaseSymbol, UpdatePostUseCase),
    // new Provider(GenerateUserActivityReportUseCaseSymbolProvider, GenerateUserActivityReportUseCaseProvider),
    // new Provider(GenerateUserActivityReportUseCaseSymbolConsumer, GenerateUserActivityReportUseCaseConsumer),
    // new Provider(MailServiceSymbol, MailService),
    // new Provider(GetUsersUseCaseSymbol, GetUsersUseCase),
    // new Provider(PostBanRepoSymbol, PostBanRepo),
    // new Provider(ApplyBanUseCaseSymbol, ApplyPostBanUseCase),
    // new Provider(GetPostBansForUserUseCaseSymbol, GetPostBansForUserUseCase),
    // PDFService,
    // PostService,
    // FileService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
