import { Field, ID, InterfaceType } from "@nestjs/graphql";

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
}
