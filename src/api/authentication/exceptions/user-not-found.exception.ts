export class UserNotFoundException extends Error {
  constructor() {
    super("The user could not be found");
  }
}
