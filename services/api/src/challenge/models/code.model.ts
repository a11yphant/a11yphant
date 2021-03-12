import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Code {
  constructor(properties: { html?: string; css?: string; js?: string }) {
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
