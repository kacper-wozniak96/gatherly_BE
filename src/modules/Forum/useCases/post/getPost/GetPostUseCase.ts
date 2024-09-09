import { Inject, Injectable } from '@nestjs/common';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { UseCase } from 'src/shared/core/UseCase';

import { REQUEST } from '@nestjs/core';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostDTO } from 'src/modules/Forum/dtos/post';
import { PostMapper } from 'src/modules/Forum/mappers/Post';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { GetPostDTO } from './GetPostDTO';
import { GetPostErrors } from './GetPostErrors';

type Response = Either<AppError.UnexpectedError | GetPostErrors.PostDoesntExistError, Result<PostDTO>>;

@Injectable()
export class GetPostUseCase implements UseCase<undefined, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(getPostDTO: GetPostDTO): Promise<Response> {
    const postIdOrError = PostId.create(new UniqueEntityID(getPostDTO.postId));

    if (postIdOrError.isFailure) return left(new AppError.UnexpectedError());

    const postId = postIdOrError.getValue();

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new GetPostErrors.PostDoesntExistError());

    if (post.user.hasSetAvatar()) {
      const userAvatarUrl = await this.awsS3Service.getFileUrl(post.user.avatarS3Key);
      post.user.updateUserAvatarSignedUrl(userAvatarUrl);
    }

    const comments = post.comments.getItems();

    await Promise.all(
      comments.map(async (comment) => {
        if (comment.user.hasSetAvatar()) {
          const signedURL = await this.awsS3Service.getFileUrl(comment.user.avatarS3Key);
          comment.user.updateUserAvatarSignedUrl(signedURL);
        }
      }),
    );

    const postDTO = PostMapper.toDTO(post, this.request.user.userId);

    return right(Result.ok<PostDTO>(postDTO));
  }
}
