// // interface IUseCaseError {
// //   message: string;
// //   field: string;
// // }

import { FailedField } from 'src/modules/User/domain/UserName';

// // export abstract class UseCaseError implements IError {
// //   public readonly message: string;
// //   public readonly field: string;

// //   constructor(error: IError) {
// //     this.message = error.message;
// //     this.field = error.field;
// //   }
// // }

// // export interface UseCase

// export abstract class UseCaseError {
//   public readonly validationErrors: IError[];
//   public readonly isValidationError: boolean;

//   constructor(validationErrors: IError[], isValidationError = true) {
//     this.validationErrors = validationErrors;
//     this.isValidationError = isValidationError;
//   }

//   public getErrors(): IError[] {
//     return this.validationErrors;
//   }
// }

interface IUseCaseError {
  message: string | FailedField[];
  isFormInvalid: boolean;
}

export abstract class UseCaseError implements IUseCaseError {
  public readonly message: string | FailedField[];
  public readonly isFormInvalid: boolean;

  constructor(message: string | FailedField[], isFormInvalid = false) {
    this.message = message;
    this.isFormInvalid = isFormInvalid;
  }
}
