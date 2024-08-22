import { IFailedField } from 'src/modules/User/domain/UserName';
import { ValueObject } from 'src/shared/core/ValueObject';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface PostTextProps {
  value: string;
}

const postDescZodSchema = z.string().max(5000, { message: 'Description must be at most 5000 characters long' });

const newChema = z.object({
  text: postDescZodSchema,
});

export class PostText extends ValueObject<PostTextProps> {
  private constructor(props: PostTextProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: PostTextProps): Result<PostText | IFailedField> {
    // const { error } = postTextSchema.validate(props.value);
    const validationResult = newChema.safeParse({ text: props.value });

    // if (error) {
    //   return Result.fail<FailedField>({ message: error.details[0].message, field: 'text' });
    // }

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      return Result.fail<IFailedField>({
        message: error.message,
        field: error.path[0] as keyof typeof newChema,
      });
    }

    return Result.ok<PostText>(new PostText(props));
  }
}
