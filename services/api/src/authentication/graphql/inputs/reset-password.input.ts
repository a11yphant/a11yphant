import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}
