import { Field, ObjectType } from "@nestjs/graphql";

import { ChangePasswordErrorCodes } from "../enums/change-password-error-codes.enum";
// import { ChangePasswordFields } from "../enums/change-password-fields.enum";

@ObjectType()
export class ChangePasswordErrorResult {
  @Field(() => ChangePasswordErrorCodes, {
    description: "The error code for the reason for the failure.",
  })
  errorCode: ChangePasswordErrorCodes;

  // @Field(() => [InputError])
  // inputErrors: InputError[];
}

// @ObjectType()
// export class InputError {
//   @Field()
//   field: ChangePasswordFields;

//   @Field()
//   message: string;
// }
