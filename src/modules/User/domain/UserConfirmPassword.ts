import { Result } from '../../../shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';

interface UserConfirmPasswordProps {
  value: string;
}

export class UserConfirmPassword extends ValueObject<UserConfirmPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserConfirmPasswordProps) {
    super(props);
  }

  public static create(props: UserConfirmPasswordProps): Result<UserConfirmPassword> {
    return Result.ok<UserConfirmPassword>(new UserConfirmPassword(props));
  }
}
