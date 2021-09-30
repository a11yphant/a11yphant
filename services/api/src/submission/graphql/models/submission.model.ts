import { Field, HideField, ID, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export abstract class Submission {
  constructor(properties: { id: string; levelId: string; createdAt: Date; updatedAt: Date }) {
    this.id = properties.id;
    this.levelId = properties.levelId;
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;
  }

  @Field(() => ID)
  id: string;

  @HideField()
  levelId: string;

  @Field(() => Date, {
    description: "The timestamp when the submission was created.",
  })
  createdAt: Date;

  @Field(() => Date, {
    description: "The timestamp when the submission has been last updated",
  })
  updatedAt: Date;
}
