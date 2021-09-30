import { ApolloError } from "apollo-server-errors";

export class InputError extends ApolloError {
  constructor(message: string) {
    super(message, "INPUT_ERROR");
  }
}
