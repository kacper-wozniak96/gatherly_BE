import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { UserId } from '../../domain/UserId';
import { UserDTO } from '../../dtos/user';
import { UserMapper } from '../../mappers/User';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { GetUserRequestDTO } from './GetUserDTO';
import { GetUserErrors } from './GetUserErrors';

type Response = Either<GetUserErrors.UserDoesntExistError | AppError.UnexpectedError, Result<UserDTO>>;

@Injectable()
export class GetUserUseCase implements UseCase<GetUserRequestDTO, Promise<Response>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(getUserDTO: GetUserRequestDTO): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(getUserDTO.userId));

    const dtoResult = Result.combine([userIdOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const userId = userIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new GetUserErrors.UserDoesntExistError());

    if (user.hasSetAvatar()) {
      const url = await this.awsS3Service.getFileUrl(user.avatarS3Key);
      user.updateUserAvatarSignedUrl(url);
    }

    const userDTO = UserMapper.toDTO(user);

    return right(Result.ok<UserDTO>(userDTO));
  }
}
