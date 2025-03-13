import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';

export namespace DeletePostErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User does not exist`,
      });
    }
  }
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post does not exist`,
        isForSnackbar: true,
      });
    }
  }

  export class UserDoesntOwnPostError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post created by another user`,
      });
    }
  }

  export class InvalidDataError extends Result<UseCaseError> {
    constructor(failedFields: IFailedField[]) {
      super(false, {
        message: failedFields,
        isFormInvalid: false,
      });
    }
  }
}
