import { usernameSchema } from 'gatherly-types';
import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';
import { z } from 'zod';

type usernameType = z.infer<typeof usernameSchema>;

const usernameField: keyof usernameType = 'username';

export namespace UpdateUserErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `A forum member doesn't exist for this account.`,
      });
    }
  }

  export class CannotUpdateGuestUserError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Cannot update guest user. Create your own account and try again`,
      });
    }
  }

  export class UsernameTakenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: [
          {
            field: usernameField,
            message: 'Username already taken',
          },
        ],
        isFormInvalid: true,
      });
    }
  }

  export class InvalidDataError extends Result<UseCaseError> {
    constructor(failedFields: IFailedField[]) {
      super(false, {
        message: failedFields,
        isFormInvalid: true,
      });
    }
  }
}
