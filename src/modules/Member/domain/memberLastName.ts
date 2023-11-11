import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';

interface MemberLastNameProps {
  lastName: string;
}

export class MemberLastName extends ValueObject<MemberLastNameProps> {
  get value(): string {
    return this.props.lastName;
  }

  private constructor(props: MemberLastNameProps) {
    super(props);
  }

  public static create(props: MemberLastNameProps): Result<MemberLastName> {
    return Result.ok<MemberLastName>(new MemberLastName(props));
  }
}
