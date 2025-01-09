import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, RequestMethod, Type } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './modules/AuthModule/Auth.guard';
import { AuthService } from './modules/AuthModule/Auth.service';
import { JwtStrategy } from './modules/AuthModule/strategies/jwt.strategy';
import { PostService } from './modules/Forum/domain/services/PostService';
import { CommentRepo } from './modules/Forum/repos/implementations/commentRepo';
import { PostBanRepo } from './modules/Forum/repos/implementations/postBanRepo';
import { PostRepo } from './modules/Forum/repos/implementations/postRepo';
import { PostVoteRepo } from './modules/Forum/repos/implementations/postVoteRepo';
import { PostBanRepoSymbol } from './modules/Forum/repos/postBanRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from './modules/Forum/repos/utils/symbols';
import { CreateCommentController } from './modules/Forum/useCases/comment/createComment/CreateCommentController';
import { CreateCommentUseCase } from './modules/Forum/useCases/comment/createComment/CreateCommentUseCase';
import { DeleteCommentController } from './modules/Forum/useCases/comment/deleteComment/DeleteCommentController';
import { DeleteCommentUseCase } from './modules/Forum/useCases/comment/deleteComment/DeleteCommentUseCase';
import { GetCommentsController } from './modules/Forum/useCases/comment/getComments/GetCommentsController';
import { GetCommentsUseCase } from './modules/Forum/useCases/comment/getComments/GetCommentsUseCase';
import {
  CreateCommentUseCaseSymbol,
  DeleteCommentUseCaseSymbol,
  GetCommentsUseCaseSymbol,
} from './modules/Forum/useCases/comment/utils/symbols';
import { CreatePostController } from './modules/Forum/useCases/post/createPost/CreatePostController';
import { CreatePostUseCase } from './modules/Forum/useCases/post/createPost/CreatePostUseCase';
import { DeletePostController } from './modules/Forum/useCases/post/deletePost/DeletePostController';
import { DeletePostUseCase } from './modules/Forum/useCases/post/deletePost/DeletePostUseCase';
import { DownVotePostController } from './modules/Forum/useCases/post/downVotePost/DownVotePostController';
import { DownVotePostUseCase } from './modules/Forum/useCases/post/downVotePost/DownVotePostUseCase';
import { GetPostController } from './modules/Forum/useCases/post/getPost/GetPostController';
import { GetPostUseCase } from './modules/Forum/useCases/post/getPost/GetPostUseCase';
import { GetPostsController } from './modules/Forum/useCases/post/getPosts/GetPostsController';
import { GetPostsUseCase } from './modules/Forum/useCases/post/getPosts/GetPostsUseCase';
import { UpdatePostController } from './modules/Forum/useCases/post/updatePost/UpdatePostController';
import { UpdatePostUseCase } from './modules/Forum/useCases/post/updatePost/UpdatePostUseCase';
import { UpVotePostController } from './modules/Forum/useCases/post/upVotePost/UpVotePostController';
import { UpVotePostUseCase } from './modules/Forum/useCases/post/upVotePost/UpVotePostUseCase';
import {
  ApplyBanUseCaseSymbol,
  CreatePostUseCaseSymbol,
  DeletePostUseCaseSymbol,
  DownVotePostUseCaseSymbol,
  GetPostsUseCaseSymbol,
  GetPostUseCaseSymbol,
  UpdatePostUseCaseSymbol,
  UpVotePostUseCaseSymbol,
} from './modules/Forum/useCases/post/utils/symbols';
import { ApplyPostBanController } from './modules/Forum/useCases/postBan/applyPostBan/ApplyPostBanController';
import { ApplyPostBanUseCase } from './modules/Forum/useCases/postBan/applyPostBan/ApplyPostBanUseCase';
import { GetPostBansForUserController } from './modules/Forum/useCases/postBan/getPostBansForUser/GetPostBansForUserController';
import { GetPostBansForUserUseCase } from './modules/Forum/useCases/postBan/getPostBansForUser/GetPostBansForUserUseCase';
import { GetPostBansForUserUseCaseSymbol } from './modules/Forum/useCases/postBan/utils/symbols';
import { LoggerMiddleware } from './modules/Logger/logger';
import { UserRepo } from './modules/User/repos/implementations/userRepo';
import { UserRepoSymbol } from './modules/User/repos/utils/symbols';
import { UserCreateController } from './modules/User/useCases/CreateUser/CreateUserController';
import { CreateUserUseCase } from './modules/User/useCases/CreateUser/CreateUserUseCase';
import { GenerateUserActivityReportController } from './modules/User/useCases/GenerateUserActivityReport/GenerateUserActivityReportController';
import { GenerateUserActivityReportUseCaseProvider } from './modules/User/useCases/GenerateUserActivityReport/GenerateUserActivityReportUseCase';
import { GenerateUserActivityReportUseCaseConsumer } from './modules/User/useCases/GenerateUserActivityReport/GenerateUserActivityReportUseCaseConsumer';
import { GetUserController } from './modules/User/useCases/getUser/GetUserController';
import { GetUserUseCase } from './modules/User/useCases/getUser/GetUserUseCase';
import { GetUsersController } from './modules/User/useCases/getUsers/GetUserController';
import { GetUsersUseCase } from './modules/User/useCases/getUsers/GetUserUseCase';
import { LoginUserController } from './modules/User/useCases/Login/LoginUserController';
import { LoginUserUseCase } from './modules/User/useCases/Login/LoginUserUseCase';
import { LogoutUserController } from './modules/User/useCases/Logout/LogoutUserController';
import { TestController } from './modules/User/useCases/Test/testController';
import { UpdateUserController } from './modules/User/useCases/UpdateUser/UpdateUserController';
import { UpdateUserUseCase } from './modules/User/useCases/UpdateUser/UpdateUserUseCase';
import {
  CreateUserUseCaseSymbol,
  GenerateUserActivityReportUseCaseSymbolConsumer,
  GenerateUserActivityReportUseCaseSymbolProvider,
  GetUsersUseCaseSymbol,
  GetUserUseCaseSymbol,
  LoginUserUseCaseSymbol,
  UpdateUserUseCaseSymbol,
} from './modules/User/utils/symbols';
import { PrismaService } from './prisma.service';
import { EQueues } from './shared/enums/Queues';
import { AwsS3Service, AwsS3ServiceSymbol } from './shared/infra/AWS/s3client';
import { PDFService } from './shared/infra/FileGenerator/pdfService';
import { FileService } from './shared/infra/FileService/fileService';
import { MailService, MailServiceSymbol } from './shared/infra/MailService/mailService';

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
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_IP,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: EQueues.reports,
    }),
  ],
  controllers: [
    TestController,
    LogoutUserController,
    CreatePostController,
    UserCreateController,
    LoginUserController,
    GetPostsController,
    UpVotePostController,
    DownVotePostController,
    GetPostController,
    CreateCommentController,
    GetUserController,
    GenerateUserActivityReportController,
    UpdateUserController,
    GetCommentsController,
    DeleteCommentController,
    DeletePostController,
    UpdatePostController,
    GetUsersController,
    ApplyPostBanController,
    GetPostBansForUserController,
  ],
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
    new Provider(DownVotePostUseCaseSymbol, DownVotePostUseCase),
    new Provider(GetPostUseCaseSymbol, GetPostUseCase),
    new Provider(CommentRepoSymbol, CommentRepo),
    new Provider(CreateCommentUseCaseSymbol, CreateCommentUseCase),
    new Provider(GetUserUseCaseSymbol, GetUserUseCase),
    new Provider(UpdateUserUseCaseSymbol, UpdateUserUseCase),
    new Provider(AwsS3ServiceSymbol, AwsS3Service),
    new Provider(GetCommentsUseCaseSymbol, GetCommentsUseCase),
    new Provider(DeleteCommentUseCaseSymbol, DeleteCommentUseCase),
    new Provider(DeletePostUseCaseSymbol, DeletePostUseCase),
    new Provider(UpdatePostUseCaseSymbol, UpdatePostUseCase),
    new Provider(GenerateUserActivityReportUseCaseSymbolProvider, GenerateUserActivityReportUseCaseProvider),
    new Provider(GenerateUserActivityReportUseCaseSymbolConsumer, GenerateUserActivityReportUseCaseConsumer),
    new Provider(MailServiceSymbol, MailService),
    new Provider(GetUsersUseCaseSymbol, GetUsersUseCase),
    new Provider(PostBanRepoSymbol, PostBanRepo),
    new Provider(ApplyBanUseCaseSymbol, ApplyPostBanUseCase),
    new Provider(GetPostBansForUserUseCaseSymbol, GetPostBansForUserUseCase),
    PDFService,
    PostService,
    FileService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
