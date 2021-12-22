export class InvalidJwtException extends Error {
  constructor() {
    super("The provided jwt is not valid");
  }
}
