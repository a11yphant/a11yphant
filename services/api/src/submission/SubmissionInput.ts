import { Field, InputType } from "@nestjs/graphql";
import { UuidScalar } from "src/scalars/uuid";

@InputType()
export class SubmissionInput {
  @Field(() => UuidScalar)
  levelId: string;
  @Field({ description: "HTML is formatted as a multi-line string with line breaks.", nullable: true })
  html: string;
  @Field({ description: "CSS is formatted as a multi-line string with line breaks.", nullable: true })
  css: string;
  @Field({ description: "JS is formatted as a multi-line string with line breaks.", nullable: true })
  js: string;
}
