import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({
  description: "A submission of an user.",
})
export class CodeLevelSubmission {
  constructor(properties: { id: string; html?: string; css?: string; js?: string; levelId: string; createdAt: Date; updatedAt: Date }) {
    this.id = properties.id;
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;

    this.levelId = properties.levelId;

    this.html = properties.html;
    this.css = properties.css;
    this.js = properties.js;
  }

  @Field(() => ID)
  id: string;

  @Field(() => Date, {
    description: "The timestamp when the submission was created.",
  })
  createdAt: Date;

  @Field(() => Date, {
    description: "The timestamp when the submission has been last updated",
  })
  updatedAt: Date;

  levelId: string;

  @Field(() => String, {
    nullable: true,
    description: "HTML is formatted as a multi-line string with line breaks.",
  })
  html?: string;

  @Field(() => String, {
    nullable: true,
    description: "CSS is formatted as a multi-line string with line breaks.",
  })
  css?: string;

  @Field(() => String, {
    nullable: true,
    description: "JS is formatted as a multi-line string with line breaks.",
  })
  js?: string;
}
