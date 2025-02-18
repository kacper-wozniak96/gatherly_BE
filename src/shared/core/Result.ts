export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error: T | string;
  private _value: T;

  public constructor(isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
    }

    return this._value;
  }

  public getErrorValue(): T {
    return this.error as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U = string>(error: U): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    const failedResults = results.filter((result) => result.isFailure);

    if (failedResults.length) {
      const errors = failedResults.map((result) => result.getErrorValue());

      return Result.fail(errors);
    }

    return Result.ok();
  }
}
