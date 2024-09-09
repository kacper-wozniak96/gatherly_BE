import { Result } from './Result';
import { UseCaseError } from './UseCaseError';

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor() {
      super(false, {
        message: `An unexpected error occurred.`,
      });
    }
  }
}
