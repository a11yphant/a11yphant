import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Code } from "./code.model";

@ObjectType()
export class Level {
  constructor(properties: { id: string; instructions: string; order: number; hasHtmlEditor: boolean; hasCssEditor: boolean; hasJsEditor: boolean }) {
    this.id = properties.id;
    this.instructions = properties.instructions;
    this.order = properties.order;

    this.hasHtmlEditor = properties.hasHtmlEditor;
    this.hasCssEditor = properties.hasCssEditor;
    this.hasJsEditor = properties.hasJsEditor;
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

  @Field(() => Code, { nullable: true, description: "The initial code for the level." })
  code?: Code;

  @Field(() => Boolean, {
    nullable: true,
    description: "If the level has the HTML editor configured.",
  })
  hasHtmlEditor?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: "If the level has the CSS editor configured.",
  })
  hasCssEditor?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: "If the level has the JS editor configured.",
  })
  hasJsEditor?: boolean;
}
