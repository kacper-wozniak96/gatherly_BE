import { Inject, Injectable } from '@nestjs/common';

import { IPostRepo } from 'src/modules/Forum/repos/postRepo';
import { PostRepoSymbol } from 'src/modules/Forum/repos/utils/symbols';
import { Result, right } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PostId } from 'src/modules/Forum/domain/postId';
import { PostDTO } from 'src/modules/Forum/dtos/post';
import { PostMapper } from 'src/modules/Forum/mappers/Post';
import { AppError } from 'src/shared/core/AppError';
import { Either, left } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { GetPostDTO } from './GetPostDTO';

type Response = Either<AppError.UnexpectedError, Result<PostDTO>>;

@Injectable()
export class GetPostUseCase implements UseCase<undefined, Promise<Response>> {
  constructor(@Inject(PostRepoSymbol) private readonly postRepo: IPostRepo) {}

  async execute(getPostDTO: GetPostDTO): Promise<Response> {
    const postIdOrError = PostId.create(new UniqueEntityID(getPostDTO.postId));

    const s3 = new S3Client({
      credentials: {
        accessKeyId: 'AKIA4RCAOI2PVVQHNWR2',
        secretAccessKey: '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',
      },
      region: 'eu-north-1',
      // endpoint: 'gatherly-accesspoint-1sqhjtyhssn41zyo513m3nz4yqn1heun1a-s3alias',
    });

    const dtoResult = Result.combine([postIdOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const postId = postIdOrError.getValue();

    const post = await this.postRepo.getPostByPostId(postId);

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: post.user.avatarS3Key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    if (!post) return left(new AppError.UnexpectedError());

    post.user.updateAvatartSignedUrl(url);

    const postDTO = PostMapper.toDTO(post);

    return right(Result.ok<PostDTO>(postDTO));
  }
}
