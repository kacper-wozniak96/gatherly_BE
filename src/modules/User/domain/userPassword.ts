import * as bcrypt from 'bcrypt';

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

  public async hashPassword(): Promise<string> {
    return await bcrypt.hash(this.props.value, 10);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    console.log({ plainTextPassword, value: this.props.value });

    return await bcrypt.compare(plainTextPassword, this.props.value);
  }
}
