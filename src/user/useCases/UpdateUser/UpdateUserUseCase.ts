import { Inject, Injectable } from '@nestjs/common';

import { AppError } from 'src/shared/core/AppError';
import { left, right } from 'src/shared/core/Either';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { UseCase } from 'src/shared/core/UseCase';
import { Changes } from 'src/utils/changes';
import { IFailedField } from 'src/utils/FailedField';
import { has } from 'src/utils/has';
import { uuid } from 'uuidv4';
import { UserAvatar } from '../../domain/UserAvatar';
import { UserConfirmPassword } from '../../domain/UserConfirmPassword';
import { UserId } from '../../domain/UserId';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { IUserRepo } from '../../repos/userRepo';
import { UserRepoSymbol } from '../../repos/utils/symbols';
import { RequestData, ResponseData } from './types';
import { UpdateUserErrors } from './UpdateUserErrors';
import { AwsS3ServiceSymbol, IAwsS3Service } from 'src/modules/common/AWS';

@Injectable()
export class UpdateUserUseCase implements UseCase<RequestData, Promise<ResponseData>> {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: IUserRepo,
    @Inject(AwsS3ServiceSymbol) private readonly awsS3Service: IAwsS3Service,
  ) {}

  async execute(requestData: RequestData): Promise<ResponseData> {
    const changes = new Changes();

    const userIdOrError = UserId.create(new UniqueEntityID(requestData.userId));

    if (userIdOrError.isFailure) return left(new AppError.UnexpectedError());

    const userId = userIdOrError.getValue();

    const user = await this.userRepo.getUserByUserId(userId);

    if (!user) return left(new UpdateUserErrors.UserDoesntExistError());

    if (user.isGuest()) {
      return left(new UpdateUserErrors.CannotUpdateGuestUserError());
    }

    console.log({ requestData });

    if (has(requestData, 'file')) {
      const userAvatarOrError = UserAvatar.create({ avatar: requestData.file });

      if (userAvatarOrError.isFailure) {
        const failedFields = [(userAvatarOrError as Result<IFailedField>).getErrorValue()];
        return left(new UpdateUserErrors.InvalidDataError(failedFields));
      }

      if (user.hasSetAvatar()) {
        await this.awsS3Service.deleteFile(user.avatarS3Key);
      }

      const avatarS3Key = uuid();
      await this.awsS3Service.sendAvatarImage(avatarS3Key, requestData.file.buffer);

      changes.addChange(user.updateAvatarS3Key(avatarS3Key));
    }

    if (has(requestData.dto, 'username')) {
      const updatedUsernameOrError = UserName.create({ value: requestData.dto.username });

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

    if (has(requestData.dto, 'password')) {
      const userPasswordOrError = UserPassword.create({ value: requestData.dto.password });
      const userConfirmPasswordOrError = UserConfirmPassword.create({ value: requestData.dto.confirmPassword });

      const dtoResult = Result.combine([userPasswordOrError, userConfirmPasswordOrError]);
      const failedFields = dtoResult.getErrorValue();

      if (dtoResult.isFailure) {
        return left(new UpdateUserErrors.InvalidDataError(failedFields));
      }

      const userPassword = userPasswordOrError.getValue() as UserPassword;
      const userConfirmPassword = userConfirmPasswordOrError.getValue();

      const doPasswordsMatch = userPassword.comparePassword(userConfirmPassword.value);

      if (!doPasswordsMatch) {
        return left(new UpdateUserErrors.PasswordsDoNotMatchError());
      }

      changes.addChange(user.updatePassword(userPassword));
    }

    if (changes.getCombinedChangesResult().isFailure) return left(new AppError.UnexpectedError());

    await this.userRepo.save(user);

    return right(Result.ok<void>());
  }
}
