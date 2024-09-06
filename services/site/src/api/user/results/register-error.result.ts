import { Field, ObjectType } from "@nestjs/graphql";

import { RegisterErrorCodes } from "../enums/register-error-codes.enum";

@ObjectType()
export class RegisterErrorResult {
  @Field(() => RegisterErrorCodes, {
    description: "The error code for the reason for the failure.",
  })
  errorCode: RegisterErrorCodes;
}
