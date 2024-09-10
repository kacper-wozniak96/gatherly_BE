import { User } from 'src/modules/User/domain/User';
import { UserId } from 'src/modules/User/domain/UserId';
import { UserName } from 'src/modules/User/domain/UserName';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

export const createStubUser = (): User => {
  const userId = UserId.create(new UniqueEntityID()).getValue();
  const userName = UserName.create({ value: 'test-user' }).getValue() as UserName;

  const userProps = {
    username: userName,
  };

  return User.create(userProps, userId.getValue()).getValue();
};
