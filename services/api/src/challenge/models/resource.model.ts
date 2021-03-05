import { Resource as ResourceRecord } from "@a11y-challenges/prisma";
import { Field, ID, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class Resource {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { description: "External link to the resource (Blog, Spec, etc.)" })
  link: string;

  static fromDatabaseRecord(record: ResourceRecord): Resource {
    const resource = new Resource();
    resource.id = record.id;
    resource.title = record.title;
    resource.link = record.link;

    return resource;
  }
}
