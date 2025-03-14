import { Inject, Injectable } from '@nestjs/common';

import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/modules/common/AWS';
import { right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UseCase } from 'src/shared/core/UseCase';
import { UserDTO } from '../../dtos/user';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { RequestData, ResponseData } from './types';

@Injectable()
export class GetUsersUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const { search } = requestData;

    const users = await this.userRepo.getUsers(search);

    await Promise.all(
      users.map((user) => {
        if (user.hasSetAvatar()) {
          return this.awsS3Service.updateUserSignedUrl(user);
        }
      }),
    );

    const usersDTOs = users.map((user) => UserMapper.toDTO(user));

    return right(Result.ok<UserDTO[]>(usersDTOs));
  }
}
