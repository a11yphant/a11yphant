import { Field, ObjectType } from "@nestjs/graphql";

import { Submission } from "./submission.model";

@ObjectType({
  description: "A submission of an user.",
  implements: [Submission],
})
export class CodeLevelSubmission extends Submission {
  constructor(properties: { id: string; html?: string; css?: string; js?: string; levelId: string; createdAt: Date; updatedAt: Date }) {
    super({ id: properties.id, levelId: properties.levelId, createdAt: properties.createdAt, updatedAt: properties.updatedAt });

    this.html = properties.html;
    this.css = properties.css;
    this.js = properties.js;
  }

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
