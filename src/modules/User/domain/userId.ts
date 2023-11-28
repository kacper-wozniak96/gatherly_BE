import { Result } from '../../../shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';

export class UserId extends ValueObject<{ value: UniqueEntityID }> {
  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  public static create(value: UniqueEntityID): Result<UserId> {
    return Result.ok<UserId>(new UserId(value));
  }
}
