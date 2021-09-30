import { Field, ObjectType } from "@nestjs/graphql";

import { Code } from "./code.model";
import { Level } from "./level.model";

@ObjectType({
  implements: () => [Level],
})
export class CodeLevel extends Level {
  constructor(properties: { id: string; instructions: string; order: number; hasHtmlEditor: boolean; hasCssEditor: boolean; hasJsEditor: boolean }) {
    super({ id: properties.id, order: properties.order });

    this.instructions = properties.instructions;
    this.hasHtmlEditor = properties.hasHtmlEditor;
    this.hasCssEditor = properties.hasCssEditor;
    this.hasJsEditor = properties.hasJsEditor;
  }

  @Field(() => String, {
    description: "Instructions use HTML to provide basic formatting.",
  })
  instructions: string;

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
