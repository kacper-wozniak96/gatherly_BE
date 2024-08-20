import { ValueObject } from 'src/shared/core/ValueObject';
import { Result } from '../../../shared/core/Result';

interface CommentTextProps {
  value: string;
}

export class CommentText extends ValueObject<CommentTextProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: CommentTextProps) {
    super(props);
  }

  public static create(props: CommentTextProps): Result<CommentText> {
    return Result.ok<CommentText>(new CommentText(props));
  }
}
