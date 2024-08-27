import { MiddlewareConsumer, Module, RequestMethod, Type } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './modules/AuthModule/Auth.guard';
import { AuthService } from './modules/AuthModule/Auth.service';
import { JwtStrategy } from './modules/AuthModule/strategies/jwt.strategy';
import { PostService } from './modules/Forum/domain/services/PostService';
import { CommentRepo } from './modules/Forum/repos/implementations/commentRepo';
import { PostRepo } from './modules/Forum/repos/implementations/postRepo';
import { PostVoteRepo } from './modules/Forum/repos/implementations/postVoteRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from './modules/Forum/repos/utils/symbols';
import { CreateCommentUseCase } from './modules/Forum/useCases/comment/createComment/CreateComment';
import { CreateCommentController } from './modules/Forum/useCases/comment/createComment/CreateCommentController';
import { DeleteCommentUseCase } from './modules/Forum/useCases/comment/deleteComment/DeleteComment';
import { DeleteCommentController } from './modules/Forum/useCases/comment/deleteComment/DeleteCommentController';
import { GetCommentsController } from './modules/Forum/useCases/comment/getComments/GetCommentsController';
import { GetCommentsUseCase } from './modules/Forum/useCases/comment/getComments/GetCommentsUseCase';
import {
  CreateCommentUseCaseSymbol,
  DeleteCommentUseCaseSymbol,
  GetCommentsUseCaseSymbol,
} from './modules/Forum/useCases/comment/utils/symbols';
import { CreatePostUseCase } from './modules/Forum/useCases/post/createPost/CreatePost';
import { CreatePostController } from './modules/Forum/useCases/post/createPost/CreatePostController';
import { DeletePostUseCase } from './modules/Forum/useCases/post/deletePost/DeletePost';
import { DeletePostController } from './modules/Forum/useCases/post/deletePost/DeletePostController';
import { DownVotePostController } from './modules/Forum/useCases/post/downVotePost/DownVotePostController';
import { DownVotePostUseCase } from './modules/Forum/useCases/post/downVotePost/DownVotePostUseCase';
import { GetPostController } from './modules/Forum/useCases/post/getPost/GetPostController';
import { GetPostUseCase } from './modules/Forum/useCases/post/getPost/GetPostUseCase';
import { GetPostsController } from './modules/Forum/useCases/post/getPosts/GetPostsController';
import { GetPostsUseCase } from './modules/Forum/useCases/post/getPosts/GetPostsUseCase';
import { UpVotePostController } from './modules/Forum/useCases/post/upVotePost/UpVotePostController';
import { UpVotePostUseCase } from './modules/Forum/useCases/post/upVotePost/UpVotePostUseCase';
import {
  CreatePostUseCaseSymbol,
  DeletePostUseCaseSymbol,
  DownVotePostUseCaseSymbol,
  GetPostsUseCaseSymbol,
  GetPostUseCaseSymbol,
  UpVotePostUseCaseSymbol,
} from './modules/Forum/useCases/post/utils/symbols';
import { LoggerMiddleware } from './modules/Logger/logger';
import { UserRepo } from './modules/User/repos/implementations/userRepo';
import { UserRepoSymbol } from './modules/User/repos/utils/symbols';
import { UserCreateController } from './modules/User/useCases/CreateUser/CreateUserController';
import { CreateUserUseCase } from './modules/User/useCases/CreateUser/CreateUserUseCase';
import { GetUserController } from './modules/User/useCases/getUser/GetUserController';
import { GetUserUseCase } from './modules/User/useCases/getUser/GetUserUseCase';
import { LoginUserController } from './modules/User/useCases/Login/LoginUserController';
import { LoginUserUseCase } from './modules/User/useCases/Login/LoginUserUseCase';
import { UpdateUserController } from './modules/User/useCases/UpdateUser/UpdateUserController';
import { UpdateUserUseCase } from './modules/User/useCases/UpdateUser/UpdateUserUseCase';
import {
  CreateUserUseCaseSymbol,
  GetUserUseCaseSymbol,
  LoginUserUseCaseSymbol,
  UpdateUserUseCaseSymbol,
} from './modules/User/utils/symbols';
import { PrismaService } from './prisma.service';
import { AwsS3Service, AwsS3ServiceSymbol } from './shared/infra/AWS/s3client';

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
  controllers: [
    CreatePostController,
    UserCreateController,
    LoginUserController,
    GetPostsController,
    UpVotePostController,
    DownVotePostController,
    GetPostController,
    CreateCommentController,
    GetUserController,
    UpdateUserController,
    GetCommentsController,
    DeleteCommentController,
    DeletePostController,
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
    PostService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
