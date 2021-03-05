import { Hint as HintRecord } from "@a11y-challenges/prisma";
import { Field, ID, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Hint {
  constructor(properties: { id: string; content: string }) {
    this.id = properties.id;
    this.content = properties.content;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;

  static fromDatabaseRecord(record: HintRecord): Hint {
    const hint = new Hint({ id: record.id, content: record.content });

    return hint;
  }
}
