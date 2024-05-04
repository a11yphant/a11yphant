import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RegisterUserInput {
  @Field({ description: "The email address of the user to register." })
  email: string;

  @Field({ description: "The password of the user to register." })
  password: string;

  @Field({ nullable: true, description: "The name for the user to display. If none is provided, the email address will be used." })
  displayName?: string;
}
