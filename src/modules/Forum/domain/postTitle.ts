import { IFailedField } from 'src/modules/User/domain/UserName';
import { ValueObject } from 'src/shared/core/ValueObject';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface PostTitleProps {
  value: string;
}

const postTitleZodSchema = z
  .string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  })
  .min(3, { message: 'Title must be at least 3 characters long' })
  .max(30, { message: 'Title must be at most 30 characters long' });

const newChema = z.object({
  title: postTitleZodSchema,
});

export class PostTitle extends ValueObject<PostTitleProps> {
  private constructor(props: PostTitleProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: PostTitleProps): Result<PostTitle | IFailedField> {
    const validationResult = newChema.safeParse({ title: props.value });

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      return Result.fail<IFailedField>({
        message: error.message,
        field: error.path[0] as keyof typeof newChema,
      });
    }

    return Result.ok<PostTitle>(new PostTitle(props));
  }
}
