import { Field, ObjectType } from "@nestjs/graphql";

import { ResetPasswordErrorCodes } from "../enums/reset-password-error-codes.enum";
import { ResetPasswordFields } from "../enums/reset-password-fields.enum";

@ObjectType()
export class ResetPasswordErrorResult {
  @Field(() => ResetPasswordErrorCodes, {
    description: "The error code for the reason for the failure.",
  })
  errorCode: ResetPasswordErrorCodes;

  @Field(() => [InputError])
  inputErrors: InputError[];
}

@ObjectType()
export class InputError {
  @Field()
  field: ResetPasswordFields;

  @Field()
  message: string;
}
