import { Inject, Injectable } from '@nestjs/common';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { FailedField, IFailedField } from 'src/utils/FailedField';
import { has } from 'src/utils/has';
import { uuid } from 'uuidv4';
import { User } from '../../domain/User';
import { UserAvatar } from '../../domain/UserAvatar';
import { UserId } from '../../domain/UserId';
import { UserName } from '../../domain/UserName';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { UpdateUserDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';

type Response = Either<
  UpdateUserErrors.UserDoesntExistError | UpdateUserErrors.InvalidDataError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

export interface WithChanges {
  changes: Changes;
}

// Extracted into its own class
export class Changes {
  private changes: Result<any>[];

  constructor() {
    this.changes = [];
  }

  public addChange(result: Result<any>): void {
    this.changes.push(result);
  }

  public getCombinedChangesResult(): Result<any> {
    return Result.combine(this.changes);
  }
}

@Injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserDTO, Promise<Response>> {
  constructor(@Inject(UserRepoSymbol) private readonly userRepo: IUserRepo) {}

  async execute(updateUserDTO: UpdateUserDTO): Promise<Response> {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: 'AKIA4RCAOI2PVVQHNWR2',
        secretAccessKey: '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',
      },
      region: 'eu-north-1',
    });
    let user: User;
    const changes = new Changes();
    let avatarS3Key: string;

    const userIdOrError = UserId.create(new UniqueEntityID(updateUserDTO.userId));

    if (userIdOrError.isFailure) return left(new AppError.UnexpectedError());

    const userId = userIdOrError.getValue();

    user = await this.userRepo.getUserByUserId(userId);

    if (!user) {
      return left(new UpdateUserErrors.UserDoesntExistError());
    }

    if (has(updateUserDTO, 'file')) {
      avatarS3Key = uuid();
      const userAvatarOrError = UserAvatar.create({ avatar: updateUserDTO.file });

      if (userAvatarOrError.isSuccess) {
        changes.addChange(user.updateAvatarS3Key(avatarS3Key));
      } else {
        left(new UpdateUserErrors.InvalidDataError([(userAvatarOrError as Result<IFailedField>).getErrorValue()]));
      }
    }

    if (has(updateUserDTO, 'username')) {
      const updatedUsernameOrError = UserName.create({ name: updateUserDTO.username });

      if (updatedUsernameOrError.isSuccess) {
        changes.addChange(user.updateUsername(updatedUsernameOrError.getValue() as UserName));
      } else {
        left(new UpdateUserErrors.InvalidDataError([(updatedUsernameOrError as Result<IFailedField>).getErrorValue()]));
      }
    }

    const userWithTheSameUserName = await this.userRepo.getUserByUsername(user.username);

    if (userWithTheSameUserName) {
      return left(new UpdateUserErrors.InvalidDataError([new FailedField('username', 'Username already exists')]));
    }

    if (changes.getCombinedChangesResult().isSuccess) {
      if (updateUserDTO?.file?.buffer) {
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Key: avatarS3Key,
            Body: updateUserDTO.file.buffer,
          }),
        );
      }
      await this.userRepo.save(user);
    } else {
      return left(new AppError.UnexpectedError());
    }

    return right(Result.ok<void>());
  }
}
