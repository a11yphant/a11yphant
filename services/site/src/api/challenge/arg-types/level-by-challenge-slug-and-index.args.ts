import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Min } from "class-validator";

@ArgsType()
export class LevelByChallengeSlugAndIndexArgs {
  @Field(() => String)
  challengeSlug: string;

  @Field(() => Int)
  @Min(1)
  nth: number;
}
