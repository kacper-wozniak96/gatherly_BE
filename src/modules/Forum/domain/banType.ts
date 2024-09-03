import { ValueObject } from 'src/shared/core/ValueObject';
import { z } from 'zod';
import { Result } from '../../../shared/core/Result';
import { EBanType } from '../useCases/post/applyPostBan/ApplyPostBanDTO';

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

  public static create(props: BanTypeProps): Result<BanType> {
    const validationResult = schema.safeParse({ value: props.value });

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      return Result.fail<any>(error.message);
    }

    return Result.ok<BanType>(new BanType(props));
  }
}
