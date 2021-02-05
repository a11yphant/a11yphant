import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Code {
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
