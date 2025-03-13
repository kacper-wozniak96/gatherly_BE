import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace GetPostBansErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Provided forum member doesn't exist`,
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

  export class UserDoesntOwnPostError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post was not created by the current user`,
      } as UseCaseError);
    }
  }
}
