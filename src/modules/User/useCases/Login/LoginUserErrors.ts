import { IError } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace LoginUserErrors {
  export class ValueObjectValidationError extends UseCaseError {
    constructor(errors: IError[]) {
      super(errors);
    }
  }

  export class UserDoesNotExistError extends UseCaseError {
    constructor() {
      super([{ field: 'user', message: 'Username or password is incorrect' }]);
    }
  }

  export class PasswordsDontMatch extends UseCaseError {
    constructor() {
      super([{ field: 'password', message: 'Username or password is incorrect' }]);
    }
  }
}
