import { WithCodeError } from "@/support/graphql/results/with-code.error";

import { RegisterErrorCodes } from "../enums/register-error-codes.enum";

export class UserRegisteredError extends WithCodeError<RegisterErrorCodes> {
  constructor() {
    super("User is already registered.", RegisterErrorCodes.USER_ALREADY_REGISTERED);
  }
}
