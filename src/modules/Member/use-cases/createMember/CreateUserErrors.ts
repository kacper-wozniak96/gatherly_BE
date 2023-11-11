import { IError } from 'src/shared/core/Result';
import { UseCaseError } from 'src/shared/core/UseCaseError';

// export class EmailAlreadyExistsError extends Result<UseCaseError> {
//   constructor() {
//     super(false, {
//       message: `The email ${email} associated for this account already exists`,
//       field: 'email',
//     });
//   }
// }

export namespace CreateMemberErrors {
  export class ValueObjectValidationError extends UseCaseError {
    constructor(errors: IError[]) {
      super(errors);
    }
  }

  export class EmailAlreadyExistsError extends UseCaseError {
    constructor() {
      super([{ field: 'email', message: `The email associated for this account already exists` }]);
    }
  }
}
