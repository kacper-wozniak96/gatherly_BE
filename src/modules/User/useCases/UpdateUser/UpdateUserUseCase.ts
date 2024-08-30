import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { Either, left, Result, right } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/shared/infra/AWS/s3client';
import { Changes } from 'src/utils/changes';
import { IFailedField } from 'src/utils/FailedField';
import { has } from 'src/utils/has';
import { uuid } from 'uuidv4';
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

@Injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserDTO, Promise<Response>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(updateUserDTO: UpdateUserDTO): Promise<Response> {
    const changes = new Changes();

    const userIdOrError = UserId.create(new UniqueEntityID(updateUserDTO.userId));

    if (userIdOrError.isFailure) return left(new AppError.UnexpectedError());

    const userId = userIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new UpdateUserErrors.UserDoesntExistError());

    if (user.isGuest()) {
      return left(new UpdateUserErrors.CannotUpdateGuestUserError());
    }

    if (has(updateUserDTO, 'file')) {
      const userAvatarOrError = UserAvatar.create({ avatar: updateUserDTO.file });

      if (userAvatarOrError.isFailure) {
        const failedFields = [(userAvatarOrError as Result<IFailedField>).getErrorValue()];
        return left(new UpdateUserErrors.InvalidDataError(failedFields));
      }

      if (user.hasSetAvatar()) {
        await this.awsS3Service.deleteFile(user.avatarS3Key);
      }
      const avatarS3Key = uuid();
      await this.awsS3Service.sendFile(avatarS3Key, updateUserDTO.file.buffer);

      changes.addChange(user.updateAvatarS3Key(avatarS3Key));
    }

    if (has(updateUserDTO, 'username')) {
      const updatedUsernameOrError = UserName.create({ value: updateUserDTO.username });

      if (updatedUsernameOrError.isFailure) {
        const failedFields = [(updatedUsernameOrError as Result<IFailedField>).getErrorValue()];
        return left(new UpdateUserErrors.InvalidDataError(failedFields));
      }

      const newUserName = updatedUsernameOrError.getValue() as UserName;
      const isUsernameTaken = await this.userRepo.getUserByUsername(newUserName);

      if (isUsernameTaken) {
        return left(new UpdateUserErrors.UsernameTakenError());
      }

      changes.addChange(user.updateUsername(newUserName));
    }

    if (changes.getCombinedChangesResult().isFailure) return left(new AppError.UnexpectedError());

    await this.userRepo.save(user);

    return right(Result.ok<void>());
  }
}
