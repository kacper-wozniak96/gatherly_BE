import * as bcrypt from 'bcrypt';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

const userPasswordSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(1, { message: 'Password must be at least 1 character long' })
    .max(30, { message: 'Password must be at most 30 characters long' }),
});

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public static create(props: UserPasswordProps): Result<UserPassword | IFailedField> {
    if (props.hashed) {
      return Result.ok<UserPassword>(new UserPassword(props));
    }

    const validationResult = userPasswordSchema.safeParse({
      password: props.value,
    });

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      return Result.fail<IFailedField>({
        message: error.message,
        field: error.path[0] as keyof typeof userPasswordSchema,
      });
    }

    return Result.ok<UserPassword>(new UserPassword(props));
  }

  public async hashPassword(): Promise<string> {
    return await bcrypt.hash(this.props.value, 10);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, this.props.value);
  }
}
