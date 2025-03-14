import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/modules/common/common.module';
import { UserModule } from 'src/modules/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { Provider } from 'src/shared/core/Provider';
import { EQueues } from 'src/shared/enums/Queues';
import { PostService } from './domain/services/PostService';
import { CommentRepo } from './repos/implementations/commentRepo';
import { PostBanRepo } from './repos/implementations/postBanRepo';
import { PostRepo } from './repos/implementations/postRepo';
import { PostVoteRepo } from './repos/implementations/postVoteRepo';
import { PostBanRepoSymbol } from './repos/postBanRepo';
import { CommentRepoSymbol, PostRepoSymbol, PostVoteRepoSymbol } from './repos/utils/symbols';
import { GenerateUserActivityReportController } from './useCases/ActivityReport/GenerateUserActivityReportController';
import { GenerateUserActivityReportUseCase } from './useCases/ActivityReport/GenerateUserActivityReportUseCase';
import { GenerateUserActivityReportUseCaseConsumer } from './useCases/ActivityReport/GenerateUserActivityReportUseCaseConsumer';
import { PDFService } from './useCases/ActivityReport/pdfService';
import {
  GenerateUserActivityReportUseCaseSymbol,
  GenerateUserActivityReportUseCaseSymbolConsumer,
} from './useCases/ActivityReport/utils/symbols';
import { CreateCommentController } from './useCases/comment/createComment/CreateCommentController';
import { CreateCommentUseCase } from './useCases/comment/createComment/CreateCommentUseCase';
import { DeleteCommentController } from './useCases/comment/deleteComment/DeleteCommentController';
import { DeleteCommentUseCase } from './useCases/comment/deleteComment/DeleteCommentUseCase';
import { GetCommentsController } from './useCases/comment/getComments/GetCommentsController';
import { GetCommentsUseCase } from './useCases/comment/getComments/GetCommentsUseCase';
import { CreateCommentUseCaseSymbol, DeleteCommentUseCaseSymbol, GetCommentsUseCaseSymbol } from './useCases/comment/utils/symbols';
import { CreatePostController } from './useCases/post/createPost/CreatePostController';
import { CreatePostUseCase } from './useCases/post/createPost/CreatePostUseCase';
import { DeletePostController } from './useCases/post/deletePost/DeletePostController';
import { DeletePostUseCase } from './useCases/post/deletePost/DeletePostUseCase';
import { DownVotePostController } from './useCases/post/downVotePost/DownVotePostController';
import { DownVotePostUseCase } from './useCases/post/downVotePost/DownVotePostUseCase';
import { GetPostController } from './useCases/post/getPost/GetPostController';
import { GetPostUseCase } from './useCases/post/getPost/GetPostUseCase';
import { GetPostsController } from './useCases/post/getPosts/GetPostsController';
import { GetPostsUseCase } from './useCases/post/getPosts/GetPostsUseCase';
import { UpdatePostController } from './useCases/post/updatePost/UpdatePostController';
import { UpdatePostUseCase } from './useCases/post/updatePost/UpdatePostUseCase';
import { UpVotePostController } from './useCases/post/upVotePost/UpVotePostController';
import { UpVotePostUseCase } from './useCases/post/upVotePost/UpVotePostUseCase';
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
import { ApplyPostBanController } from './useCases/postBan/applyPostBan/ApplyPostBanController';
import { ApplyPostBanUseCase } from './useCases/postBan/applyPostBan/ApplyPostBanUseCase';
import { GetPostBansForUserController } from './useCases/postBan/getPostBansForUser/GetPostBansForUserController';
import { GetPostBansForUserUseCase } from './useCases/postBan/getPostBansForUser/GetPostBansForUserUseCase';
import { GetPostBansForUserUseCaseSymbol } from './useCases/postBan/utils/symbols';

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
