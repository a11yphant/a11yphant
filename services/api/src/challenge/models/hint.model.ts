import { Hint as HintRecord } from "@a11y-challenges/prisma";
import { Field, ID, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Hint {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;

  static fromDatabaseRecord(record: HintRecord): Hint {
    const hint = new Hint();
    hint.id = record.id;
    hint.content = record.content;

    return hint;
  }
}
