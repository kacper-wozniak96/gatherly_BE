import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { ValueObject } from 'src/shared/core/ValueObject';

interface PostIdProps {
  value: UniqueEntityID;
}

export class PostId extends ValueObject<PostIdProps> {
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
    return Result.ok<PostId>(new PostId(value));
  }
}
