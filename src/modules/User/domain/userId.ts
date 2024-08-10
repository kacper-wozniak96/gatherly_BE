import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { ValueObject } from 'src/shared/core/ValueObject';
import { Result } from '../../../shared/core/Result';

export interface UserIdProps {
  value: UniqueEntityID;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  public static create(value: UniqueEntityID): Result<UserId> {
    return Result.ok<UserId>(new UserId(value));
  }
}
