import { Guard } from 'src/shared/core/Guard';
import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { ValueObject } from 'src/shared/core/ValueObject';

export class PostId extends ValueObject<{ value: UniqueEntityID }> {
  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  public static create(value: UniqueEntityID): Result<PostId> {
    const guardResult = Guard.againstNullOrUndefined(value, 'value');
    if (guardResult.isFailure) {
      return Result.fail<any>(guardResult.getErrorValue());
    }

    return Result.ok<PostId>(new PostId(value));
  }
}
