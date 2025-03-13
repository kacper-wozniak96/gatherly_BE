import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace LoginUseCaseErrors {
  export class UserNameDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Username or password incorrect`,
      } as UseCaseError);
    }
  }

  export class PasswordDoesntMatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Username or password incorrect`,
      } as UseCaseError);
    }
  }

  export class InvalidDataError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Username or password incorrect`,
      } as UseCaseError);
    }
  }
}
