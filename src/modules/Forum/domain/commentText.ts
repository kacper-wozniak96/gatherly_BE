import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface CommentTextProps {
  value: string;
}

const schema = z.object({
  text: z.string().max(5000, { message: 'Comment must be at most 5000 characters long' }),
});

export class CommentText extends ValueObject<CommentTextProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: CommentTextProps) {
    super(props);
  }

  public static create(props: CommentTextProps): Result<CommentText | IFailedField> {
    const validationResult = schema.safeParse({ text: props.value });

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      return Result.fail<IFailedField>({
        message: error.message,
        field: error.path[0] as keyof typeof schema,
      });
    }

    return Result.ok<CommentText>(new CommentText(props));
  }
}
