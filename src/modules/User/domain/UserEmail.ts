import { userEmailSchema } from 'gatherly-types';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  private constructor(props: UserEmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: UserEmailProps): Result<UserEmail | IFailedField> {
    type TValue = z.infer<typeof userEmailSchema>;
    const validationResult = this.validate<TValue>(userEmailSchema, {
      email: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<UserEmail>(new UserEmail(props));
  }
}
