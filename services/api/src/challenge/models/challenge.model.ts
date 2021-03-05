import { Challenge as ChallengeRecord } from "@a11y-challenges/prisma";
import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Level } from "./level.model";

@ObjectType({
  description: "General and level information for a specific challenge.",
})
export class Challenge {
  constructor(properties: { id: string; name: string }) {
    this.id = properties.id;
    this.name = properties.name;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [Level], {
    description: "All levels for this challenge.",
  })
  levels: Level[];

  static fromDatabaseRecord(record: ChallengeRecord): Challenge {
    const challenge = new Challenge({ id: record.id, name: record.name });

    return challenge;
  }
}
