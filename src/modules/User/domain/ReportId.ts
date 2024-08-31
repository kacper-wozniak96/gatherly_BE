import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Result } from '../../../shared/core/Result';

interface ReportIdProps {
  value: string;
}

export class ReportId extends ValueObject<ReportIdProps> {
  private constructor(props: ReportIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: ReportIdProps): Result<ReportId | IFailedField> {
    if (!uuidValidate(props.value)) {
      return Result.fail<IFailedField>({
        message: 'Invalid UUID format',
        field: 'value',
      });
    }

    return Result.ok<ReportId>(new ReportId(props));
  }

  public static generate(): ReportId {
    const id = uuidv4();
    return new ReportId({ value: id });
  }
}
