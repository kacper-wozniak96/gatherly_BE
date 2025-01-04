import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface BanValueProps {
  value: boolean;
}

const schema = z.object({
  value: z.boolean(),
});

export class BanValue extends ValueObject<BanValueProps> {
  private constructor(props: BanValueProps) {
    super(props);
  }

  get value(): boolean {
    return this.props.value;
  }

  public static create(props: BanValueProps): Result<BanValue> | Result<IFailedField> {
    type TValue = z.infer<typeof schema>;
    const validationResult = this.validate<TValue>(schema, {
      value: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<BanValue>(new BanValue(props));
  }
}
