export class LevelNotFoundException extends Error {
  constructor() {
    super("The level could not be found");
  }
}
