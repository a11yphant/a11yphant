import { Field, ObjectType } from "@nestjs/graphql";

import { InputError } from "@/support/graphql/results/input-error";

import { RequestPasswordResetErrorCodes } from "../enums/request-password-reset-error-codes.enum";
import { RequestPasswordResetFields } from "../enums/request-password-reset-fields.enum";

@ObjectType()
export class RequestPasswordResetErrorResult {
  @Field(() => RequestPasswordResetErrorCodes, {
    description: "The error code for the reason for the failure.",
  })
  errorCode: RequestPasswordResetErrorCodes;

  @Field(() => [RequestPasswordResetInputError])
  inputErrors: RequestPasswordResetInputError[];
}

@ObjectType()
class RequestPasswordResetInputError extends InputError<RequestPasswordResetFields>(RequestPasswordResetFields) {}
