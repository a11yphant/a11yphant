export class UserRegisteredError extends Error {
  constructor() {
    super("User is already registered.");
  }
}
