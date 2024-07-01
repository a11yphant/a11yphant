export class WithCodeError<T = string> extends Error {
  public code: T;

  constructor(message: string, code: T) {
    super(message);
    this.code = code;
  }
}
