export class InvalidOperationException extends Error {
  constructor() {
    super("The user is not local");
  }
}
