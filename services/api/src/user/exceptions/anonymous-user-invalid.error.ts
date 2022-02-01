export class AnonymousUserInvalidError extends Error {
  constructor() {
    super("Anonymous user is invalid.");
  }
}
