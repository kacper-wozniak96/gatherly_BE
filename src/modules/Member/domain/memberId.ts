import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { ValueObject } from 'src/shared/core/ValueObject';

export class MemberId extends ValueObject<{ value: UniqueEntityID }> {
  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  public static create(value: UniqueEntityID): Result<MemberId> {
    return Result.ok<MemberId>(new MemberId(value));
  }
}
