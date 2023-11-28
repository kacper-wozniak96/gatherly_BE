import { IError } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace CreatePostErrors {
  export class ValueObjectValidationError extends UseCaseError {
    constructor(errors: IError[]) {
      super(errors);
    }
  }

  export class UserDoesNotExistError extends UseCaseError {
    constructor() {
      super([{ field: 'user', message: `User does not exist` }]);
    }
  }

  export class PostCreationError extends UseCaseError {
    constructor() {
      super([{ field: '', message: `Post can not be created` }]);
    }
  }
}
