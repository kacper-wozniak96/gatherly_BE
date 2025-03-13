import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, RequestMethod, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './modules/AuthModule/Auth.guard';
import { AuthService } from './modules/AuthModule/Auth.service';
import { JwtStrategy } from './modules/AuthModule/strategies/jwt.strategy';
import { PostService } from './forum/domain/services/PostService';
import { CommentRepo } from './forum/repos/implementations/commentRepo';
import { PostBanRepo } from './forum/repos/implementations/postBanRepo';
import { PostRepo } from './forum/repos/implementations/postRepo';
import { PostVoteRepo } from './forum/repos/implementations/postVoteRepo';
import { PostBanRepoSymbol } from './forum/repos/postBanRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from './forum/repos/utils/symbols';
import { CreateCommentController } from './forum/useCases/comment/createComment/CreateCommentController';
import { CreateCommentUseCase } from './forum/useCases/comment/createComment/CreateCommentUseCase';
import { DeleteCommentController } from './forum/useCases/comment/deleteComment/DeleteCommentController';
import { DeleteCommentUseCase } from './forum/useCases/comment/deleteComment/DeleteCommentUseCase';
import { GetCommentsController } from './forum/useCases/comment/getComments/GetCommentsController';
import { GetCommentsUseCase } from './forum/useCases/comment/getComments/GetCommentsUseCase';
import { CreateCommentUseCaseSymbol, DeleteCommentUseCaseSymbol, GetCommentsUseCaseSymbol } from './forum/useCases/comment/utils/symbols';
import { CreatePostController } from './forum/useCases/post/createPost/CreatePostController';
import { CreatePostUseCase } from './forum/useCases/post/createPost/CreatePostUseCase';
import { DeletePostController } from './forum/useCases/post/deletePost/DeletePostController';
import { DeletePostUseCase } from './forum/useCases/post/deletePost/DeletePostUseCase';
import { DownVotePostController } from './forum/useCases/post/downVotePost/DownVotePostController';
import { DownVotePostUseCase } from './forum/useCases/post/downVotePost/DownVotePostUseCase';
import { GetPostController } from './forum/useCases/post/getPost/GetPostController';
import { GetPostUseCase } from './forum/useCases/post/getPost/GetPostUseCase';
import { GetPostsController } from './forum/useCases/post/getPosts/GetPostsController';
import { GetPostsUseCase } from './forum/useCases/post/getPosts/GetPostsUseCase';
import { UpdatePostController } from './forum/useCases/post/updatePost/UpdatePostController';
import { UpdatePostUseCase } from './forum/useCases/post/updatePost/UpdatePostUseCase';
import { UpVotePostController } from './forum/useCases/post/upVotePost/UpVotePostController';
import { UpVotePostUseCase } from './forum/useCases/post/upVotePost/UpVotePostUseCase';
import {
  ApplyBanUseCaseSymbol,
  CreatePostUseCaseSymbol,
  DeletePostUseCaseSymbol,
  DownVotePostUseCaseSymbol,
  GetPostsUseCaseSymbol,
  GetPostUseCaseSymbol,
  UpdatePostUseCaseSymbol,
  UpVotePostUseCaseSymbol,
} from './forum/useCases/post/utils/symbols';
import { ApplyPostBanController } from './forum/useCases/postBan/applyPostBan/ApplyPostBanController';
import { ApplyPostBanUseCase } from './forum/useCases/postBan/applyPostBan/ApplyPostBanUseCase';
import { GetPostBansForUserController } from './forum/useCases/postBan/getPostBansForUser/GetPostBansForUserController';
import { GetPostBansForUserUseCase } from './forum/useCases/postBan/getPostBansForUser/GetPostBansForUserUseCase';
import { GetPostBansForUserUseCaseSymbol } from './forum/useCases/postBan/utils/symbols';
import { LoggerMiddleware } from './modules/Logger/logger';
import { UserRepo } from './user/repos/implementations/userRepo';
import { UserRepoSymbol } from './user/repos/utils/symbols';
import { UserCreateController } from './user/useCases/CreateUser/CreateUserController';
import { CreateUserUseCase } from './user/useCases/CreateUser/CreateUserUseCase';
import { GenerateUserActivityReportController } from './user/useCases/GenerateUserActivityReport/GenerateUserActivityReportController';
import { GenerateUserActivityReportUseCaseProvider } from './user/useCases/GenerateUserActivityReport/GenerateUserActivityReportUseCase';
import { GenerateUserActivityReportUseCaseConsumer } from './user/useCases/GenerateUserActivityReport/GenerateUserActivityReportUseCaseConsumer';
import { GetUserController } from './user/useCases/getUser/GetUserController';
import { GetUserUseCase } from './user/useCases/getUser/GetUserUseCase';
import { GetUsersController } from './user/useCases/getUsers/GetUserController';
import { GetUsersUseCase } from './user/useCases/getUsers/GetUserUseCase';
import { LoginUserController } from './user/useCases/Login/LoginUserController';
import { LoginUserUseCase } from './user/useCases/Login/LoginUserUseCase';
import { LogoutUserController } from './user/useCases/Logout/LogoutUserController';
import { TestController } from './user/useCases/Test/testController';
import { UpdateUserController } from './user/useCases/UpdateUser/UpdateUserController';
import { UpdateUserUseCase } from './user/useCases/UpdateUser/UpdateUserUseCase';
import {
  CreateUserUseCaseSymbol,
  GenerateUserActivityReportUseCaseSymbolConsumer,
  GenerateUserActivityReportUseCaseSymbolProvider,
  GetUsersUseCaseSymbol,
  GetUserUseCaseSymbol,
  LoginUserUseCaseSymbol,
  UpdateUserUseCaseSymbol,
} from './user/utils/symbols';
import { PrismaService } from './prisma.service';
import { EQueues } from './shared/enums/Queues';
import { AwsS3Service, AwsS3ServiceSymbol } from './shared/infra/AWS/s3client';
import { PDFService } from './shared/infra/FileGenerator/pdfService';
import { FileService } from './shared/infra/FileService/fileService';
import { MailService, MailServiceSymbol } from './shared/infra/MailService/mailService';
import { ForumModule } from './forum/forum.module';
import { UserModule } from './user/user.module';

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
