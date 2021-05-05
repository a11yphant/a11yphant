import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Code } from "./code.model";
import { Hint } from "./hint.model";
import { Requirement } from "./requirement.model";
import { Resource } from "./resource.model";

@ObjectType()
export class Level {
  constructor(properties: { id: string; tldr: string; instructions: string; order: number }) {
    this.id = properties.id;
    this.tldr = properties.tldr;
    this.instructions = properties.instructions;
    this.order = properties.order;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String, {
    description: "A shortened version of the instructions.",
  })
  tldr: string;

  @Field(() => String, {
    description: "Instructions use HTML to provide basic formatting.",
  })
  instructions: string;

  @Field(() => Number, {
    description: "The order of the level in the challenge.",
  })
  order: number;

  @Field(() => [Requirement])
  requirements: Requirement[];

  @Field(() => [Hint], {
    description: "Hints are ordered by the information content of the hint; eg more general hints are first.",
  })
  hints: Hint[];

  @Field(() => [Resource], {
    description: "Resources which provide more information on the topic of the current level.",
  })
  resources: Resource[];

  @Field(() => Code, { nullable: true, description: "The initial code for the challenge." })
  code?: Code;
}
