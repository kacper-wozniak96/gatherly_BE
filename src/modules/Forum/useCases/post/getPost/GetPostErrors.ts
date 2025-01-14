import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace GetPostErrors {
  export class PostDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post doesn't exist`,
      });
    }
  }

  export class UserBannedFromViewingPostError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User is banned from viewing this post`,
      });
    }
  }
}
