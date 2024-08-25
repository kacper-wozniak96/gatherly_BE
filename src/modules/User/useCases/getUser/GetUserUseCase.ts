import { Inject, Injectable } from '@nestjs/common';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
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
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(getUserDTO: GetUserRequestDTO): Promise<Response> {
    const userIdOrError = UserId.create(new UniqueEntityID(getUserDTO.userId));

    const s3 = new S3Client({
      credentials: {
        accessKeyId: 'AKIA4RCAOI2PVVQHNWR2',
        secretAccessKey: '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',
      },
      region: 'eu-north-1',
      // endpoint: 'gatherly-accesspoint-1sqhjtyhssn41zyo513m3nz4yqn1heun1a-s3alias',
    });

    const dtoResult = Result.combine([userIdOrError]);

    if (dtoResult.isFailure) {
      return left(new AppError.UnexpectedError());
    }

    const userId = userIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new GetUserErrors.UserDoesntExistError());

    if (user?.avatarS3Key) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: user.avatarS3Key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      user.updateUserAvatarSignedUrl(url);
    }

    const userDTO = UserMapper.toDTO(user);

    return right(Result.ok<UserDTO>(userDTO));
  }
}
