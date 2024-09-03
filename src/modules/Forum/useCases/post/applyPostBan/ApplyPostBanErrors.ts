import { Result } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

export namespace ApplyPostBanErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Provided forum member doesn't exist`,
      } as UseCaseError);
    }
  }
  export class BannedUserDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Provided banned member doesn't exist`,
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

  export class PostNotCreatedByUserError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Post was not created by the current user`,
      } as UseCaseError);
    }
  }
}
