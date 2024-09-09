import { Inject, Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { CommentId } from 'src/modules/Forum/domain/commentId';
import { PostId } from 'src/modules/Forum/domain/postId';
import { ICommentRepo } from 'src/modules/Forum/repos/commentRepo';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { CommentRepoSymbol, PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { DeleteCommentUseCaseData } from './DeleteCommentDTO';
import { DeleteCommentErrors } from './DeleteCommentErrors';

type Response = Either<DeleteCommentErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

@Injectable()
export class DeleteCommentUseCase implements UseCase<DeleteCommentUseCaseData, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
    @Inject(CommentRepoSymbol) private readonly commentRepo: ICommentRepo,
  ) {}

  async execute(deleteCommentUseCaseData: DeleteCommentUseCaseData): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const postIdOrError = PostId.create(new UniqueEntityID(deleteCommentUseCaseData.postId));
    const commentIdOrError = CommentId.create(new UniqueEntityID(deleteCommentUseCaseData.commentId));

    const dtoResult = Result.combine([userIdOrError, postIdOrError, commentIdOrError]);

    if (dtoResult.isFailure) {
      return left(new DeleteCommentErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const userId = userIdOrError.getValue();
    const postId = postIdOrError.getValue();
    const commentId = commentIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new DeleteCommentErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new DeleteCommentErrors.PostDoesntExistError());

    const comment = await this.commentRepo.getCommentByCommentId(commentId);

    if (!comment) return left(new DeleteCommentErrors.CommentDoesntExistError());

    if (!comment.isCreatedByUser(userId)) return left(new DeleteCommentErrors.UserDoesntOwnCommentError());

    post.deleteComment(comment);

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
