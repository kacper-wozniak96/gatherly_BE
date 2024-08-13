import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace UpVotePostErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Provided forum member doesn't exist`,
      } as UseCaseError);
    }
  }
  export class InvalidDataError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Invalid data.`,
      } as UseCaseError);
    }
  }
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post with provied postId doesn't exist`,
      } as UseCaseError);
    }
  }
}
