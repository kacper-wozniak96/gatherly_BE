import { passwordSchema, usernameSchema } from 'gatherly-types';
import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';

type usernameType = z.infer<typeof usernameSchema>;
type passwordType = z.infer<typeof passwordSchema>;

const usernameField: keyof usernameType = 'username';
const passwordField: keyof passwordType = 'password';

export namespace CreateUserErrors {
  export class UsernameTakenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: [
          {
            field: usernameField,
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
            field: passwordField,
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
