import { IFailedField } from 'src/utils/FailedField';
import { ZodSchema } from 'zod';
import { Result } from './Result';

interface ValueObjectProps {
  [index: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  failedResult?: Result<IFailedField>;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T;

  constructor(props: T) {
    const baseProps: any = {
      ...props,
    };

    this.props = baseProps;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  static validate<TValue>(schema: ZodSchema, props: TValue): ValidationResult {
    const validationResult = schema.safeParse(props);

    if (!validationResult.success) {
      const error = validationResult.error.errors[0];

      const result = Result.fail<IFailedField>({
        message: error.message,
        field: error.path[0] as keyof typeof schema,
      });

      return {
        isValid: false,
        failedResult: result,
      };
    }

    return {
      isValid: true,
    };
  }
}
