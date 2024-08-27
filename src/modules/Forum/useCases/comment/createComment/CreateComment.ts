import { Inject, Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { Comment } from 'src/modules/Forum/domain/comment';
import { CommentText } from 'src/modules/Forum/domain/commentText';
import { PostId } from 'src/modules/Forum/domain/postId';
import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UserId } from 'src/modules/User/domain/UserId';
import { IUserRepo } from 'src/modules/User/repos/userRepo';
import { UserRepoSymbol } from 'src/modules/User/repos/utils/symbols';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { CreateCommentRequestDTO } from './CreateCommentDTO';
import { CreateCommentErrors } from './CreateCommentErrors';

type Response = Either<CreateCommentErrors.UserDoesntExistError | AppError.UnexpectedError | Result<void>, Result<void>>;

@Injectable()
export class CreateCommentUseCase implements UseCase<CreateCommentRequestDTO, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(createCommentRequestDTO: CreateCommentRequestDTO): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(this.request.user.userId));
    const postIdOrError = PostId.create(new UniqueEntityID(createCommentRequestDTO.postId));
    const commentTextOrError = CommentText.create({ value: createCommentRequestDTO.comment });

    const dtoResult = Result.combine([userIdOrError, postIdOrError, commentTextOrError]);

    if (dtoResult.isFailure) {
      return left(new CreateCommentErrors.InvalidDataError(dtoResult.getErrorValue()));
    }

    const userId = userIdOrError.getValue();
    const postId = postIdOrError.getValue();
    const commentText = commentTextOrError.getValue() as CommentText;

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new CreateCommentErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new CreateCommentErrors.PostDoesntExistError());

    const commentOrError = Comment.create({
      userId: userId,
      text: commentText,
      postId,
      user,
    });

    if (commentOrError.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const comment = commentOrError.getValue();

    post.addComment(comment);

    await this.postRepo.save(post);

    return right(Result.ok<void>());
  }
}
