import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { UserDTO } from '../../dtos/user';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { ResponseData } from './types';

@Injectable()
export class GetUsersUseCase implements UseCase<void, Promise<ResponseData>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(): Promise<ResponseData> {
    try {
      const users = await this.userRepo.getUsers();

      await Promise.all(
        users.map(async (user) => {
          if (user.hasSetAvatar()) {
            const url = await this.awsS3Service.getFileUrl(user.avatarS3Key);
            user.updateUserAvatarSignedUrl(url);
          }
        }),
      );

      const usersDTOs = users.map((user) => UserMapper.toDTO(user));

      return right(Result.ok<UserDTO[]>(usersDTOs));
    } catch (err) {
      return left(new AppError.UnexpectedError());
    }
  }
}
