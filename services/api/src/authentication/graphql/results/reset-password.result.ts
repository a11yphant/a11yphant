import { Field, ObjectType } from "@nestjs/graphql";

import { ResetPasswordResultEnum } from "@/authentication/enums/reset-password-result.enum";

@ObjectType()
export class ResetPasswordResult {
  @Field(() => ResetPasswordResultEnum)
  result: ResetPasswordResultEnum;
}
