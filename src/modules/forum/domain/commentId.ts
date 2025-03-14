import { Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/core/UniqueEntityID';
import { ValueObject } from 'src/shared/core/ValueObject';

interface CommentIdProps {
  value: UniqueEntityID;
}

export class CommentId extends ValueObject<CommentIdProps> {
  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  public static create(value: UniqueEntityID): Result<CommentId> {
    return Result.ok<CommentId>(new CommentId(value));
  }
}
