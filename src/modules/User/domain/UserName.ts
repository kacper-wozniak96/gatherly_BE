import * as Joi from 'joi';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
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

  public static create(props: UserNameProps): Result<UserName> | Result<IFailedField> {
    const { error } = usernameSchema.validate(props.name);

    if (error) {
      return Result.fail<IFailedField>({ message: error.details[0].message, field: 'username' });
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
