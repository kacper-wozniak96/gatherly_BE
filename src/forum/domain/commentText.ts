import { commentSchema } from 'gatherly-types';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from 'src/shared/core/Result';

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

  public static create(props: CommentTextProps): Result<CommentText | IFailedField> {
    type TValue = z.infer<typeof commentSchema>;
    const validationResult = this.validate<TValue>(commentSchema, {
      comment: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<CommentText>(new CommentText(props));
  }
}
