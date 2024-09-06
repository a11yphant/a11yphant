import { Field, ObjectType } from "@nestjs/graphql";

import { ValidatePasswordResetTokenResultEnum } from "@/authentication/graphql/enums/validate-password-reset-token-result.enum";

@ObjectType()
export class ValidatePasswordResetTokenResult {
  @Field(() => ValidatePasswordResetTokenResultEnum, {
    description: "The result of validating a password reset token.",
  })
  result: ValidatePasswordResetTokenResultEnum;
}
