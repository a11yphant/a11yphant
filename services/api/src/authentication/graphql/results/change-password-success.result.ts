import { Field, ObjectType } from "@nestjs/graphql";

import { ChangePasswordSuccessResultEnum } from "../enums/change-password-success-result.enum";

@ObjectType()
export class ChangePasswordSuccessResult {
  @Field(() => ChangePasswordSuccessResultEnum, {
    description: "The result of a successful password change operation.",
  })
  result: ChangePasswordSuccessResultEnum;
}
