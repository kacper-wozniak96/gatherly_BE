// // interface IUseCaseError {
// //   message: string;
// //   field: string;
// // }

import { IUseCaseError } from 'gatherly-types';
import { IFailedField } from 'src/utils/FailedField';

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

// interface IUseCaseError {
//   message: string | IFailedField[];
//   isFormInvalid?: boolean;
//   isForSnackbar?: boolean;
// }

export abstract class UseCaseError implements IUseCaseError {
  public readonly message: string | IFailedField[];
  public readonly isFormInvalid?: boolean;
  public readonly isForSnackbar?: boolean;

  constructor(message: string | IFailedField[], isFormInvalid = false, isForSnackbar = false) {
    this.message = message;
    this.isFormInvalid = isFormInvalid;
    this.isForSnackbar = isForSnackbar;
  }
}
