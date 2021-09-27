import { Field, HideField, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  constructor(properties: { id: string; displayName: string; authId?: string; authProvider?: string }) {
    this.id = properties.id;
    this.displayName = properties.displayName;
    this.authProvider = properties.authProvider || "anonymous";
    this.authId = properties.authId;
  }

  @Field(() => String, { description: "The users id." })
  id: string;

  @Field(() => String, { description: "The users display name." })
  displayName?: string;

  @HideField()
  authProvider: string;

  @HideField()
  authId?: string;
}
