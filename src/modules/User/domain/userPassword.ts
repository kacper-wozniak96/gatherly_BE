import { Result } from '../../../shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';

interface UserPasswordProps {
  value: string;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public static create(props: UserPasswordProps): Result<UserPassword> {
    return Result.ok<UserPassword>(new UserPassword(props));
  }
}
