import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Code } from "./code.model";

@ObjectType()
export class Level {
  @Field(() => ID)
  id: string;

  @Field(() => String, {
    description: "Instructions are formatted as a multi-line string with line breaks.",
  })
  instructions: string;

  @Field(() => [String])
  requirements: string[];

  @Field(() => [String], {
    description: "Hints are ordered by the information content of the hint; eg more general hints are first.",
  })
  hints: string[];

  @Field(() => [String])
  resources: string[];

  @Field(() => Code, { nullable: true })
  startingCode?: Code;
}
