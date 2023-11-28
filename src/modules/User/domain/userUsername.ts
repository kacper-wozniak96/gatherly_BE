import { Result } from '../../../shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';

interface UserUsernameProps {
  value: string;
}

export class UserUsername extends ValueObject<UserUsernameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserUsernameProps) {
    super(props);
  }

  public static create(props: UserUsernameProps): Result<UserUsername> {
    return Result.ok<UserUsername>(new UserUsername(props));
  }
}
