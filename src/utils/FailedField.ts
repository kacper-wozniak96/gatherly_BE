export interface IFailedField {
  field: string;
  message: string;
}

export class FailedField implements IFailedField {
  constructor(
    public field: string,
    public message: string,
  ) {}
}
