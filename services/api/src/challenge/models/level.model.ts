import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Code } from "./code.model";
import { Hint } from "./hint.model";
import { Requirement } from "./requirement.model";
import { Resource } from "./resource.model";

@ObjectType()
export class Level {
  @Field(() => ID)
  id: string;

  @Field(() => String, {
    description: "Instructions are formatted as a multi-line string with line breaks.",
  })
  instructions: string;

  @Field(() => [Requirement])
  requirements: Requirement[];

  @Field(() => [Hint], {
    description: "Hints are ordered by the information content of the hint; eg more general hints are first.",
  })
  hints: Hint[];

  @Field(() => [Resource])
  resources: Resource[];

  @Field(() => Code, { nullable: true })
  code?: Code;
}
