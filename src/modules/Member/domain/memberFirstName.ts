import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';

interface MemberFirstNameProps {
  firstName: string;
}

export class MemberFirstName extends ValueObject<MemberFirstNameProps> {
  get value(): string {
    return this.props.firstName;
  }

  private constructor(props: MemberFirstNameProps) {
    super(props);
  }

  public static create(props: MemberFirstNameProps): Result<MemberFirstName> {
    return Result.ok<MemberFirstName>(new MemberFirstName(props));
  }
}
