import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';

export namespace UpdateUserErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `A forum member doesn't exist for this account.`,
      } as UseCaseError);
    }
  }

  export class UsernameTakenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: [
          {
            field: 'username',
            message: 'Username already taken',
          },
        ],
        isFormInvalid: false,
      } as UseCaseError);
    }
  }

  // export class InvalidDataError extends Result<UseCaseError> {
  //   constructor() {
  //     super(false, {
  //       message: `Invalid data`,
  //     } as UseCaseError);
  //   }
  // }

  export class InvalidDataError extends Result<UseCaseError> {
    constructor(failedFields: IFailedField[]) {
      super(false, {
        message: failedFields,
        isFormInvalid: true,
      } as UseCaseError);
    }
  }
}
