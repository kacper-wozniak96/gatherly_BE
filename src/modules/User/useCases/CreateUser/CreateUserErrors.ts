import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';

export namespace CreateUserErrors {
  export class UsernameTakenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: [
          {
            field: 'username',
            message: `Username already taken`,
          },
        ],
        isFormInvalid: true,
      } as UseCaseError);
    }
  }

  export class PasswordsDoNotMatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: [
          {
            field: 'confirmPassword',
            message: `Passwords do not match`,
          },
        ],
        isFormInvalid: true,
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
