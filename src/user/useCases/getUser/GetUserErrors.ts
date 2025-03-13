import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace GetUserErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `A forum member doesn't exist for this account.`,
      } as UseCaseError);
    }
  }
}
