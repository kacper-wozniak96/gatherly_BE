import * as Joi from 'joi';
import { ValueObject } from 'src/shared/core/ValueObject';
import { Result } from '../../../shared/core/Result';

interface UserNameProps {
  name: string;
}

const usernameSchema = Joi.string().alphanum().min(3).max(30).required();

export class UserName extends ValueObject<UserNameProps> {
  private constructor(props: UserNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.name;
  }

  public static create(props: UserNameProps): Result<UserName> | Result<FailedField> {
    const { error } = usernameSchema.validate(props.name);

    if (error) {
      // return Result.fail<UserName>(error.details[0].message);
      return Result.fail<FailedField>({ message: error.details[0].message, field: 'username' });
    }

    return Result.ok<UserName>(new UserName(props));
  }
}

export interface FailedField {
  field: string;
  message: string;
}
