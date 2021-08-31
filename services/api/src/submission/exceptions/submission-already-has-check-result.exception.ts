export class SubmissionAlreadyHasCheckResultException extends Error {
  constructor() {
    super("The submission already has a check result");
  }
}
