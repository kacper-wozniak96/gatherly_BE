import { Inject, Injectable } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { PostBanDTO } from 'gatherly-types';
import { CustomRequest } from 'src/modules/Auth/strategies/jwt.strategy';
import { PostBanMapper } from 'src/modules/forum/mappers/PostBan';
import { PostRepo } from 'src/modules/forum/repos/implementations/postRepo';
import { IPostBanRepo, PostBanRepoSymbol } from 'src/modules/forum/repos/postBanRepo';
import { PostRepoSymbol } from 'src/modules/forum/repos/utils/symbols';
import { UserRepo } from 'src/modules/user/repos/implementations/userRepo';
import { UserRepoSymbol } from 'src/modules/user/repos/utils/symbols';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { GetPostBansErrors } from './GetPostBansForUserErrors';
import { RequestData, ResponseData } from './types';

@Injectable()
export class GetPostBansForUserUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(PostBanRepoSymbol) private readonly postBanRepo: IPostBanRepo,
    @Inject(PostRepoSymbol) private readonly postRepo: PostRepo,
    @Inject(UserRepoSymbol) private readonly userRepo: UserRepo,
    @Inject(REQUEST) private readonly request: CustomRequest,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const user = await this.userRepo.getUserByUserId(this.request.user.userId);

    if (!user) return left(new GetPostBansErrors.UserDoesntExistError());

    const searchedUser = await this.userRepo.getUserByUserId(requestData.searchedUserId);

    if (!searchedUser) return left(new GetPostBansErrors.UserDoesntExistError());

    const post = await this.postRepo.getPostByPostId(requestData.postId);

    if (!post) return left(new GetPostBansErrors.PostDoesntExistError());

    if (!post.isCreatedByUser(user.userId)) return left(new GetPostBansErrors.UserDoesntOwnPostError());

    const searchedUserPostBans = await this.postBanRepo.getUserPostBans(post.postId, searchedUser.userId);

    const userPostBansDTO = searchedUserPostBans.map((ban) => PostBanMapper.toDTO(ban));

    return right(Result.ok<PostBanDTO[]>(userPostBansDTO));
  }
}
