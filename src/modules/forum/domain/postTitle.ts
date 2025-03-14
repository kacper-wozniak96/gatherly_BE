import { postTitleSchema } from 'gatherly-types';
import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';

interface PostTitleProps {
  value: string;
}

export class PostTitle extends ValueObject<PostTitleProps> {
  private constructor(props: PostTitleProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: PostTitleProps): Result<PostTitle | IFailedField> {
    type TValue = z.infer<typeof postTitleSchema>;
    const validationResult = this.validate<TValue>(postTitleSchema, {
      title: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<PostTitle>(new PostTitle(props));
  }
}
