export class TransactionRetriesExhaustedError extends Error {
  constructor() {
    super("The number of retries for the transaction was exhausted");
  }
}
