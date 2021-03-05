import { Requirement as RequirementRecord } from "@a11y-challenges/prisma";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Requirement {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  static fromDatabaseRecord(record: RequirementRecord): Requirement {
    const requirement = new Requirement();
    requirement.id = record.id;
    requirement.title = record.title;

    return requirement;
  }
}
