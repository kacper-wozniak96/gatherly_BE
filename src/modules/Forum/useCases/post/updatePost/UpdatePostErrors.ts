import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';

export namespace UpdatePostErrors {
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `The post doesn't exist.`,
      } as UseCaseError);
    }
  }

  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User with this ID doesn't exist.`,
      } as UseCaseError);
    }
  }

  export class InvalidDataError extends Result<UseCaseError> {
    constructor(failedFields: IFailedField[]) {
      super(false, {
        message: failedFields,
        isFormInvalid: true,
      } as UseCaseError);
    }
  }
}
