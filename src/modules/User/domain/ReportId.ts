import { reportIdSchema } from 'gatherly-types';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
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
    type TValue = z.infer<typeof reportIdSchema>;
    const validationResult = this.validate<TValue>(reportIdSchema, {
      reportId: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<ReportId>(new ReportId(props));
  }
}
