import * as bcrypt from 'bcrypt';
import * as Joi from 'joi';

import { ValueObject } from 'src/shared/core/ValueObject';
import { Result } from '../../../shared/core/Result';
import { FailedField } from './UserName';

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

const userPasswordSchema = Joi.string().alphanum().min(1).max(30).required();

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public static create(props: UserPasswordProps): Result<UserPassword> | Result<FailedField> {
    if (props.hashed) {
      return Result.ok<UserPassword>(new UserPassword(props));
    }

    const { error } = userPasswordSchema.validate(props.value);

    if (error) {
      return Result.fail<FailedField>({ message: error.details[0].message, field: 'password' });
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
