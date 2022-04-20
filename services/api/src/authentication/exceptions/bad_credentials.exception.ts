export class BadCredentialsException extends Error {
  constructor() {
    super("The provided password is not correct");
  }
}
