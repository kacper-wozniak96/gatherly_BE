import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';
import { IFailedField } from 'src/utils/FailedField';

export namespace CreateCommentErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `A forum member doesn't exist for this account.`,
      });
    }
  }
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post with provided postId doesn't exist`,
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
  export class UserBannedFromAddingCommentsError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User is banned adding comments to this post`,
      });
    }
  }
}
