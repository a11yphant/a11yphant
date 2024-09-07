import { registerEnumType } from "@nestjs/graphql";

export enum LevelStatus {
  OPEN,
  IN_PROGRESS,
  FINISHED,
}

registerEnumType(LevelStatus, {
  name: "LevelStatus",
  valuesMap: {
    OPEN: {
      description: "The level has not yet been started.",
    },
    IN_PROGRESS: {
      description: "The level has been attempted, but was not successfully finished.",
    },
    FINISHED: {
      description: "The level has been successfully finished.",
    },
  },
});
