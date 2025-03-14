import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';

export namespace DeleteCommentErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User does not exist`,
      } as UseCaseError);
    }
  }
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post does not exist`,
      } as UseCaseError);
    }
  }
  export class CommentDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Comment does not exist`,
      } as UseCaseError);
    }
  }
  export class UserDoesntOwnCommentError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Comment created by another user`,
      } as UseCaseError);
    }
  }

  export class InvalidDataError extends Result<UseCaseError> {
    constructor(failedFields: IFailedField[]) {
      super(false, {
        message: failedFields,
        isFormInvalid: false,
      } as UseCaseError);
    }
  }
}
