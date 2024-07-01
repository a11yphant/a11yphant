import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RequestPasswordResetInput {
  @Field()
  email: string;
}
