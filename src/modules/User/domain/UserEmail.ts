import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface UserEmailProps {
  value: string;
}

const userEmailSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email address' }),
});

export class UserEmail extends ValueObject<UserEmailProps> {
  private constructor(props: UserEmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: UserEmailProps): Result<UserEmail | IFailedField> {
    const validationResult = userEmailSchema.safeParse({
      email: props.value,
    });

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      return Result.fail<IFailedField>({
        message: error.message,
        field: error.path[0] as keyof typeof userEmailSchema,
      });
    }

    return Result.ok<UserEmail>(new UserEmail(props));
  }
}
