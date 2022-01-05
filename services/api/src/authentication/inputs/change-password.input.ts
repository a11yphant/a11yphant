import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}
