import { Field, ObjectType } from "@nestjs/graphql";

import { ResetPasswordResultEnum } from "@/authentication/graphql/enums/reset-password-result.enum";

@ObjectType()
export class ResetPasswordResult {
  @Field(() => ResetPasswordResultEnum)
  result: ResetPasswordResultEnum;
}
