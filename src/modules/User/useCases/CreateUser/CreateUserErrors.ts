import { IError } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace CreateUserErrors {
  export class ValueObjectValidationError extends UseCaseError {
    constructor(errors: IError[]) {
      super(errors);
    }
  }

  export class PasswordsDoNotMatchError extends UseCaseError {
    constructor() {
      super([{ field: 'password', message: 'Passwords do not match.' }]);
    }
  }

  export class UsernameTakenError extends UseCaseError {
    constructor() {
      super([{ field: 'username', message: 'Username already taken.' }]);
    }
  }

  export class UserCreationError extends UseCaseError {
    constructor() {
      super([{ field: 'user', message: 'Error while creating user.' }]);
    }
  }

  export class PasswordHashingError extends UseCaseError {
    constructor() {
      super([{ field: 'password', message: 'Error while hashing password.' }]);
    }
  }
}
