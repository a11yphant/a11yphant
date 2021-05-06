import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Code } from "./code.model";
import { Requirement } from "./requirement.model";
import { Task } from "./task.model";

@ObjectType()
export class Level {
  constructor(properties: { id: string; instructions: string; order: number }) {
    this.id = properties.id;
    this.instructions = properties.instructions;
    this.order = properties.order;
  }

  @Field(() => ID)
  id: string;

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

  @Field(() => [Task], {
    description: "The tasks that need to be solved for this level.",
  })
  tasks: Task[];

  @Field(() => Code, { nullable: true, description: "The initial code for the challenge." })
  code?: Code;
}
