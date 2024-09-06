import { WithCodeError } from "@/support/graphql/results/with-code.error";

import { RegisterErrorCodes } from "../enums/register-error-codes.enum";

export class EmailInUseError extends WithCodeError<RegisterErrorCodes> {
  constructor() {
    super("E-Mail address already in use.", RegisterErrorCodes.EMAIL_IN_USE);
  }
}
