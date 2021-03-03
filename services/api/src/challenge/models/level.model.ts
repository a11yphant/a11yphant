import { Level as LevelRecord } from "@a11y-challenges/prisma";
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
    description: "A shortened version of the instructions.",
  })
  tldr: string;

  @Field(() => String, {
    description: "Instructions use HTML to provide basic formatting.",
  })
  instructions: string;

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

  public static fromDatabaseRecord(record: LevelRecord): Level {
    const level = new Level();
    level.id = record.id;
    level.tldr = record.tldr;
    level.instructions = record.instructions;

    if (!record.html && !record.css && !record.js) {
      return level;
    }

    level.code = new Code();
    level.code.html = record.html;
    level.code.css = record.css;
    level.code.js = record.js;

    return level;
  }
}
