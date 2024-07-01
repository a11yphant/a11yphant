import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RequestCodeLevelCheckInput {
  @Field()
  submissionId: string;
}
