import { CodeLevelDetailsFragment, QuizLevelDetailsFragment } from "app/generated/graphql";

type LevelDetails = QuizLevelDetailsFragment | CodeLevelDetailsFragment;

export const isQuizLevel = (level: LevelDetails): level is QuizLevelDetailsFragment => {
  return level.__typename === "QuizLevel";
};

export const isCodeLevel = (level: LevelDetails): level is CodeLevelDetailsFragment => {
  return level.__typename === "CodeLevel";
};
