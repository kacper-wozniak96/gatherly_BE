import * as bcrypt from 'bcrypt';
import { passwordSchema } from 'gatherly-types';
import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

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

    type TValue = z.infer<typeof passwordSchema>;
    const validationResult = this.validate<TValue>(passwordSchema, {
      password: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    const hashedPassword = bcrypt.hashSync(props.value, 10);

    console.log({ hashedPassword });

    return Result.ok<UserPassword>(new UserPassword({ value: hashedPassword, hashed: true }));
  }

  public comparePassword(plainTextPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, this.value);
  }
}
