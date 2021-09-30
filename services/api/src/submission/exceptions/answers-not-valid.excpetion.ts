export class AnswersNotValidException extends Error {
  constructor() {
    super("The provided answers are not valid for this level.");
  }
}
