import { usernameSchema } from 'gatherly-types';
import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';

interface UserNameProps {
  value: string;
}

export class UserName extends ValueObject<UserNameProps> {
  private constructor(props: UserNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: UserNameProps): Result<UserName | IFailedField> {
    type TValue = z.infer<typeof usernameSchema>;
    const validationResult = this.validate<TValue>(usernameSchema, {
      username: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
