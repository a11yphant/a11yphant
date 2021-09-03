import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RequestCheckInput {
  @Field()
  submissionId: string;
}
