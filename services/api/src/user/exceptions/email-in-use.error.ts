export class EmailInUseError extends Error {
  constructor() {
    super("E-Mail address already in use.");
  }
}
