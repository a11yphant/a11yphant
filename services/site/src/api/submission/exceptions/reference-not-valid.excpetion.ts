export class ReferenceNotValidException extends Error {
  constructor() {
    super("One of the provided IDs does not reference an entry in the database.");
  }
}
