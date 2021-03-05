import { Requirement as RequirementRecord } from "@a11y-challenges/prisma";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Requirement {
  constructor(properties: { id: string; title: string }) {
    this.id = properties.id;
    this.title = properties.title;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  static fromDatabaseRecord(record: RequirementRecord): Requirement {
    const requirement = new Requirement({
      id: record.id,
      title: record.title,
    });

    return requirement;
  }
}
