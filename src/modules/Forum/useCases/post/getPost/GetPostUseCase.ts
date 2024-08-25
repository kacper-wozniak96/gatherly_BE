import { Inject, Injectable } from '@nestjs/common';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';

import { PostId } from 'src/modules/Forum/domain/postId';
import { PostDTO } from 'src/modules/Forum/dtos/post';
import { PostMapper } from 'src/modules/Forum/mappers/Post';
import { AppError } from 'src/shared/core/AppError';
import { Either, left } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { Changes } from 'src/utils/changes';
import { GetPostDTO } from './GetPostDTO';
import { GetPostErrors } from './GetPostErrors';

type Response = Either<AppError.UnexpectedError | GetPostErrors.PostDoesntExistError, Result<PostDTO>>;

@Injectable()
export class GetPostUseCase implements UseCase<undefined, Promise<Response>> {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(getPostDTO: GetPostDTO): Promise<Response> {
    const changes = new Changes();

    const postIdOrError = PostId.create(new UniqueEntityID(getPostDTO.postId));

    if (postIdOrError.isFailure) return left(new AppError.UnexpectedError());

    const postId = postIdOrError.getValue();

    const post = await this.postRepo.getPostByPostId(postId);

    if (!post) return left(new GetPostErrors.PostDoesntExistError());

    if (post.user.hasSetAvatar()) {
      const userAvatarUrl = await this.awsS3Service.getFileUrl(post.user.avatarS3Key);
      changes.addChange(post.user.updateUserAvatarSignedUrl(userAvatarUrl));
    }

    if (changes.getCombinedChangesResult().isFailure) return left(new AppError.UnexpectedError());

    const postDTO = PostMapper.toDTO(post);

    return right(Result.ok<PostDTO>(postDTO));
  }
}
