export class BadUserInputException extends Error {
  constructor() {
    super("The provided password is not correct");
  }
}
