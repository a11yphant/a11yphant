import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ValidatePasswordResetTokenInput {
  @Field()
  token: string;
}
