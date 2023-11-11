import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/core/ValueObject';

interface MemberEmailProps {
  email: string;
}

export class MemberEmail extends ValueObject<MemberEmailProps> {
  get value(): string {
    return this.props.email;
  }

  private constructor(props: MemberEmailProps) {
    super(props);
  }

  public static create(props: MemberEmailProps): Result<MemberEmail> {
    return Result.ok<MemberEmail>(new MemberEmail(props));
  }
}
