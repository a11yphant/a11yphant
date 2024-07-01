export class CheckProviderNotFound extends Error {
  constructor(checkKey: string) {
    super(`No check provider for a check with the key ${checkKey} was not found`);
  }
}
