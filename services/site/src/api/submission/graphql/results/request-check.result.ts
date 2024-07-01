import { Field, ObjectType } from "@nestjs/graphql";

import { Result } from "../models/result.model";

@ObjectType()
export class RequestCheckResult {
  @Field()
  result: Result;
}
