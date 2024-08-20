import { FailedField } from 'src/modules/User/domain/UserName';
import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace CreateCommentErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `A forum member doesn't exist for this account.`,
      } as UseCaseError);
    }
  }
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post with provided postId doesn't exist`,
      } as UseCaseError);
    }
  }
  export class InvalidDataError extends Result<UseCaseError> {
    constructor(failedFields: FailedField[]) {
      super(false, {
        message: failedFields,
        isFormInvalid: true,
      } as UseCaseError);
    }
  }
}
