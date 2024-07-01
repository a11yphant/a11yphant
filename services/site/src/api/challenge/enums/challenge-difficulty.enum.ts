import { registerEnumType } from "@nestjs/graphql";

export enum ChallengeDifficulty {
  EASY,
  MEDIUM,
  HARD,
}

registerEnumType(ChallengeDifficulty, {
  name: "ChallengeDifficulty",
  description: "The difficulty of a challenge.",
});
