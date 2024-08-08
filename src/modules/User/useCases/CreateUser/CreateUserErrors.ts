import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace CreateUserErrors {
  export class UsernameTakenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Username is taken`,
      } as UseCaseError);
    }
  }

  export class PasswordsDoNotMatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Passwords do not match`,
      } as UseCaseError);
    }
  }
}
