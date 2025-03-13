import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreatePostController } from './useCases/post/createPost/CreatePostController';
import { GetPostsController } from './useCases/post/getPosts/GetPostsController';
import { UpVotePostController } from './useCases/post/upVotePost/UpVotePostController';
import { DownVotePostController } from './useCases/post/downVotePost/DownVotePostController';
import { GetPostController } from './useCases/post/getPost/GetPostController';
import { CreateCommentController } from './useCases/comment/createComment/CreateCommentController';
import { GetCommentsController } from './useCases/comment/getComments/GetCommentsController';
import { DeleteCommentController } from './useCases/comment/deleteComment/DeleteCommentController';
import { DeletePostController } from './useCases/post/deletePost/DeletePostController';
import { UpdatePostController } from './useCases/post/updatePost/UpdatePostController';
import { ApplyPostBanController } from './useCases/postBan/applyPostBan/ApplyPostBanController';
import { GetPostBansForUserController } from './useCases/postBan/getPostBansForUser/GetPostBansForUserController';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/modules/AuthModule/Auth.service';
import { JwtStrategy } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/modules/AuthModule/Auth.guard';
import { Provider } from 'src/shared/core/Provider';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from './repos/utils/symbols';
import { PostRepo } from './repos/implementations/postRepo';
import {
  ApplyBanUseCaseSymbol,
  CreatePostUseCaseSymbol,
  DeletePostUseCaseSymbol,
  DownVotePostUseCaseSymbol,
  GetPostsUseCaseSymbol,
  GetPostUseCaseSymbol,
  UpdatePostUseCaseSymbol,
  UpVotePostUseCaseSymbol,
} from './useCases/post/utils/symbols';
import { CreatePostUseCase } from './useCases/post/createPost/CreatePostUseCase';
import { GetPostsUseCase } from './useCases/post/getPosts/GetPostsUseCase';
import { PostVoteRepo } from './repos/implementations/postVoteRepo';
import { UpVotePostUseCase } from './useCases/post/upVotePost/UpVotePostUseCase';
import { DownVotePostUseCase } from './useCases/post/downVotePost/DownVotePostUseCase';
import { GetPostUseCase } from './useCases/post/getPost/GetPostUseCase';
import { CommentRepo } from './repos/implementations/commentRepo';
import { CreateCommentUseCaseSymbol, DeleteCommentUseCaseSymbol, GetCommentsUseCaseSymbol } from './useCases/comment/utils/symbols';
import { CreateCommentUseCase } from './useCases/comment/createComment/CreateCommentUseCase';
import { GetCommentsUseCase } from './useCases/comment/getComments/GetCommentsUseCase';
import { DeleteCommentUseCase } from './useCases/comment/deleteComment/DeleteCommentUseCase';
import { DeletePostUseCase } from './useCases/post/deletePost/DeletePostUseCase';
import { UpdatePostUseCase } from './useCases/post/updatePost/UpdatePostUseCase';
import { PostBanRepoSymbol } from './repos/postBanRepo';
import { PostBanRepo } from './repos/implementations/postBanRepo';
import { ApplyPostBanUseCase } from './useCases/postBan/applyPostBan/ApplyPostBanUseCase';
import { GetPostBansForUserUseCaseSymbol } from './useCases/postBan/utils/symbols';
import { GetPostBansForUserUseCase } from './useCases/postBan/getPostBansForUser/GetPostBansForUserUseCase';
import { PostService } from './domain/services/PostService';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/modules/common/common.module';
import { GenerateUserActivityReportController } from './useCases/ActivityReport/GenerateUserActivityReportController';
import {
  GenerateUserActivityReportUseCaseSymbol,
  GenerateUserActivityReportUseCaseSymbolConsumer,
} from './useCases/ActivityReport/utils/symbols';
import { GenerateUserActivityReportUseCase } from './useCases/ActivityReport/GenerateUserActivityReportUseCase';
import { BullModule } from '@nestjs/bullmq';
import { EQueues } from 'src/shared/enums/Queues';
import { GenerateUserActivityReportUseCaseConsumer } from './useCases/ActivityReport/GenerateUserActivityReportUseCaseConsumer';
import { PDFService } from './useCases/ActivityReport/pdfService';

const postRepoProvider = new Provider(PostRepoSymbol, PostRepo);
const createPostUseCaseProvider = new Provider(CreatePostUseCaseSymbol, CreatePostUseCase);
const getPostsUseCaseProvider = new Provider(GetPostsUseCaseSymbol, GetPostsUseCase);
const postVoteRepoProvider = new Provider(PostVoteRepoSymbol, PostVoteRepo);
const upVotePostUseCaseProvider = new Provider(UpVotePostUseCaseSymbol, UpVotePostUseCase);
const downVotePostUseCaseProvider = new Provider(DownVotePostUseCaseSymbol, DownVotePostUseCase);
const getPostUseCaseProvider = new Provider(GetPostUseCaseSymbol, GetPostUseCase);
const commentRepoProvider = new Provider(CommentRepoSymbol, CommentRepo);
const createCommentUseCaseProvider = new Provider(CreateCommentUseCaseSymbol, CreateCommentUseCase);
const getCommentsUseCaseProvider = new Provider(GetCommentsUseCaseSymbol, GetCommentsUseCase);
const deleteCommentUseCaseProvider = new Provider(DeleteCommentUseCaseSymbol, DeleteCommentUseCase);
const deletePostUseCaseProvider = new Provider(DeletePostUseCaseSymbol, DeletePostUseCase);
const updatePostUseCaseProvider = new Provider(UpdatePostUseCaseSymbol, UpdatePostUseCase);
const postBanRepoProvider = new Provider(PostBanRepoSymbol, PostBanRepo);
const applyBanUseCaseProvider = new Provider(ApplyBanUseCaseSymbol, ApplyPostBanUseCase);
const getPostBansForUserUseCaseProvider = new Provider(GetPostBansForUserUseCaseSymbol, GetPostBansForUserUseCase);
const generateUserActivityReportUseCaseProvider = new Provider(GenerateUserActivityReportUseCaseSymbol, GenerateUserActivityReportUseCase);
const generateUserActivityReportConsumerProvider = new Provider(
  GenerateUserActivityReportUseCaseSymbolConsumer,
  GenerateUserActivityReportUseCaseConsumer,
);

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
    ConfigModule.forRoot(),
    UserModule,
    CommonModule,
  ],
  controllers: [
    CreatePostController,
    GetPostsController,
    UpVotePostController,
    DownVotePostController,
    GetPostController,
    CreateCommentController,
    GetCommentsController,
    DeleteCommentController,
    DeletePostController,
    UpdatePostController,
    ApplyPostBanController,
    GetPostBansForUserController,
    GenerateUserActivityReportController,
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
    postRepoProvider,
    createPostUseCaseProvider,
    getPostsUseCaseProvider,
    postVoteRepoProvider,
    upVotePostUseCaseProvider,
    downVotePostUseCaseProvider,
    getPostUseCaseProvider,
    commentRepoProvider,
    createCommentUseCaseProvider,
    getCommentsUseCaseProvider,
    deleteCommentUseCaseProvider,
    deletePostUseCaseProvider,
    updatePostUseCaseProvider,
    postBanRepoProvider,
    applyBanUseCaseProvider,
    getPostBansForUserUseCaseProvider,
    generateUserActivityReportUseCaseProvider,
    generateUserActivityReportConsumerProvider,
    PostService,
    PDFService,
  ],
  exports: [],
})
export class ForumModule {}
