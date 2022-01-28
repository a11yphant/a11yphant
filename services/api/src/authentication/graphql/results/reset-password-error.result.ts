import { Field, ObjectType } from "@nestjs/graphql";

import { InputError } from "@/support/graphql/results/input-error";

import { ResetPasswordErrorCodes } from "../enums/reset-password-error-codes.enum";
import { ResetPasswordFields } from "../enums/reset-password-fields.enum";

@ObjectType()
export class ResetPasswordErrorResult {
  @Field(() => ResetPasswordErrorCodes, {
    description: "The error code for the reason for the failure.",
  })
  errorCode: ResetPasswordErrorCodes;

  @Field(() => [ResetPasswordInputError])
  inputErrors: ResetPasswordInputError[];
}

@ObjectType()
class ResetPasswordInputError extends InputError<ResetPasswordFields>(ResetPasswordFields) {}
