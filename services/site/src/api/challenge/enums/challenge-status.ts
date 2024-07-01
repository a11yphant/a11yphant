import { registerEnumType } from "@nestjs/graphql";

export enum ChallengeStatus {
  OPEN,
  IN_PROGRESS,
  FINISHED,
}

registerEnumType(ChallengeStatus, {
  name: "ChallengeStatus",
  valuesMap: {
    OPEN: {
      description: "The challenge has not yet been started.",
    },
    IN_PROGRESS: {
      description: "The challenge has been started, but was not successfully finished.",
    },
    FINISHED: {
      description: "The challenge has been successfully finished.",
    },
  },
});
