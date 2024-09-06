import { Field, ObjectType } from "@nestjs/graphql";

import { RequestPasswordResetSuccessResultEnum } from "../enums/request-password-reset-success-result.enum";

@ObjectType()
export class RequestPasswordResetSuccessResult {
  @Field(() => RequestPasswordResetSuccessResultEnum, {
    description: "The result of a successful request password reset operation.",
  })
  result: RequestPasswordResetSuccessResultEnum;
}
