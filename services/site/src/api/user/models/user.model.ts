import { Field, HideField, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  constructor(properties: {
    id: string;
    displayName?: string;
    email?: string;
    password?: string;
    authId?: string;
    authProvider?: string;
    verifiedAt?: Date;
  }) {
    this.id = properties.id;
    this.displayName = properties.displayName;
    this.email = properties.email;
    this.password = properties.password;
    this.authProvider = properties.authProvider || "anonymous";
    this.authId = properties.authId;
    this.verifiedAt = properties.verifiedAt;
  }

  @Field(() => String, { description: "The users id." })
  id: string;

  @Field(() => String, { description: "The users display name." })
  displayName?: string;

  @Field(() => String, { nullable: true, description: "The email of an locally registered user" })
  email?: string;

  @HideField()
  password?: string;

  @HideField()
  authProvider: string;

  @HideField()
  authId?: string;

  @HideField()
  verifiedAt?: Date;
}
