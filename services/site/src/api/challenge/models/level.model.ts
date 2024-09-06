import { Field, ID, InterfaceType } from "@nestjs/graphql";

import { LevelStatus } from "../enums/level-status.enum";

@InterfaceType()
export abstract class Level {
  constructor(properties: { id: string; order: number }) {
    this.id = properties.id;
    this.order = properties.order;
  }

  @Field(() => ID)
  id: string;

  @Field(() => Number, {
    description: "The order of the level in the challenge.",
  })
  order: number;

  @Field(() => LevelStatus, { description: "The status of the level for the current user." })
  status: LevelStatus;
}
