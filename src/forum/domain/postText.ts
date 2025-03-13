import { postTextSchema } from 'gatherly-types';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface PostTextProps {
  value: string;
}

export class PostText extends ValueObject<PostTextProps> {
  private constructor(props: PostTextProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: PostTextProps): Result<PostText | IFailedField> {
    type TValue = z.infer<typeof postTextSchema>;
    const validationResult = this.validate<TValue>(postTextSchema, {
      text: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<PostText>(new PostText(props));
  }
}
