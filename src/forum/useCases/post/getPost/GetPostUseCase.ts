import { Inject, Injectable } from '@nestjs/common';

import { IPostRepo } from 'src/forum/repos/postRepo';
import { PostRepoSymbol } from 'src/forum/repos/utils/symbols';

import { REQUEST } from '@nestjs/core';
import { EBanType, PostDTO } from 'gatherly-types';
import { CustomRequest } from 'src/modules/AuthModule/strategies/jwt.strategy';
import { PostBan } from 'src/forum/domain/postBan';
import { PostMapper } from 'src/forum/mappers/Post';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/forum/repos/postBanRepo';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
// import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { GetPostErrors } from './GetPostErrors';
import { IGetPostUseCase, RequestData, ResponseData } from './types';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/modules/common/AWS';

@Injectable()
export class GetPostUseCase implements IGetPostUseCase {
  constructor(
    @Inject(PostRepoSymbol) private readonly postRepo: IPostRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const post = await this.postRepo.getPostByPostId(requestData.postId);

    console.log('new modulesss');

    if (!post) return left(new GetPostErrors.PostDoesntExistError());

    const existingBansOnUser = await this.postBanRepo.getUserPostBans(post.postId, this.request.user.userId);

    const isUserBanned = PostBan.isUserBanned(existingBansOnUser, EBanType.viewingPost);

    if (isUserBanned) return left(new GetPostErrors.UserBannedFromViewingPostError());

    if (post.user.hasSetAvatar()) {
      await this.awsS3Service.updateUserSignedUrl(post.user);
      // post.user.updateUserAvatarSignedUrl(userAvatarUrl);
    }

    const comments = post.comments.getItems();

    await Promise.all(
      comments.map((comment) => {
        if (comment.user.hasSetAvatar()) {
          return this.awsS3Service.updateUserSignedUrl(comment.user);
          // const signedURL = await this.awsS3Service.getFileUrl(comment.user.avatarS3Key);
          // comment.user.updateUserAvatarSignedUrl(signedURL);
        }
      }),
    );

    const postDTO = PostMapper.toDTO(post, this.request.user.userId);

    return right(Result.ok<PostDTO>(postDTO));
  }
}
