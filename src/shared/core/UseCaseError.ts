import { IUseCaseError } from 'gatherly-types';
import { IFailedField } from 'src/utils/FailedField';

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
