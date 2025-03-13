import { EBanType } from 'gatherly-types';
import { ValueObject } from 'src/shared/core/ValueObject';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';

interface BanTypeProps {
  value: EBanType;
}

const banSchema = z.nativeEnum(EBanType);

const schema = z.object({
  value: banSchema,
});

export class BanType extends ValueObject<BanTypeProps> {
  private constructor(props: BanTypeProps) {
    super(props);
  }

  get value(): EBanType {
    return this.props.value;
  }

  public static create(props: BanTypeProps): Result<BanType> | Result<IFailedField> {
    type TValue = z.infer<typeof schema>;
    const validationResult = this.validate<TValue>(schema, {
      value: props.value,
    });

    if (!validationResult.isValid) {
      return validationResult.failedResult;
    }

    return Result.ok<BanType>(new BanType(props));
  }
}
