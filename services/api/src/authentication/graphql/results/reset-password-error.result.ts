import { Field, ObjectType } from "@nestjs/graphql";

import { ResetPasswordErrorCodes } from "../enums/reset-password-error-codes.enum";

@ObjectType()
export class ResetPasswordErrorResult {
  @Field(() => ResetPasswordErrorCodes, {
    description: "The error code for the reason for the failure.",
  })
  errorCode: ResetPasswordErrorCodes;
}
