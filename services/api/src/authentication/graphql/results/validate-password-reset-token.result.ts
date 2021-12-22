import { Field, ObjectType } from "@nestjs/graphql";

import { ValidatePasswordResetTokenResultEnum } from "@/authentication/graphql/enums/validate-password-reset-token-result.enum";

@ObjectType()
export class ValidatePasswordResetTokenResult {
  @Field(() => ValidatePasswordResetTokenResultEnum)
  result: ValidatePasswordResetTokenResultEnum;
}
