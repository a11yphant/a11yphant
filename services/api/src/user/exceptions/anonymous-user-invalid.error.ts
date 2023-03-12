import { WithCodeError } from "@/support/graphql/results/with-code.error";

import { RegisterErrorCodes } from "../enums/register-error-codes.enum";

export class AnonymousUserInvalidError extends WithCodeError<RegisterErrorCodes> {
  constructor() {
    super("Anonymous user is invalid.", RegisterErrorCodes.ANONYMOUS_USER_INVALID);
  }
}
