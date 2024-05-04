export class SubmissionNotFoundException extends Error {
  constructor() {
    super("The submission could not be found");
  }
}
