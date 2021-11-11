import { ChallengeDifficulty } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

export interface DifficultyProps {
  className?: string;
  firstClassName?: string;
  secondClassName?: string;
  thirdClassName?: string;
}

export const DifficultyEasy = ({ className, firstClassName, secondClassName, thirdClassName }: DifficultyProps): React.ReactElement => {
  return (
    <>
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          firstClassName,
          "border-2 rounded-sm border-grey bg-grey mr-1",
          "group-hover:border-grey-dark group-hover:bg-grey-dark",
        )}
      />
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          secondClassName,
          "border-2 rounded-sm border-grey bg-transparent mr-1",
          "group-hover:border-grey-dark",
        )}
      />
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          thirdClassName,
          "border-2 rounded-sm border-grey bg-transparent",
          "group-hover:border-grey-dark",
        )}
      />
    </>
  );
};

export const DifficultyMedium = ({ className, firstClassName, secondClassName, thirdClassName }: DifficultyProps): React.ReactElement => {
  return (
    <>
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          firstClassName,
          "border-2 rounded-sm border-grey bg-grey mr-1",
          "group-hover:border-grey-dark group-hover:bg-grey-dark",
        )}
      />
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          secondClassName,
          "border-2 rounded-sm border-grey bg-grey mr-1",
          "group-hover:border-grey-dark group-hover:bg-grey-dark",
        )}
      />
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          thirdClassName,
          "border-2 rounded-sm border-grey bg-transparent",
          "group-hover:border-grey-dark",
        )}
      />
    </>
  );
};

export const DifficultyHard = ({ className, firstClassName, secondClassName, thirdClassName }: DifficultyProps): React.ReactElement => {
  return (
    <>
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          firstClassName,
          "border-2 rounded-sm border-grey bg-grey mr-1",
          "group-hover:border-grey-dark group-hover:bg-grey-dark",
        )}
      />
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          secondClassName,
          "border-2 rounded-sm border-grey bg-grey mr-1",
          "group-hover:border-grey-dark group-hover:bg-grey-dark",
        )}
      />
      <span
        className={clsx(
          className,
          className === undefined && "w-2.5 h-4/5",
          thirdClassName,
          "border-2 rounded-sm border-grey bg-grey",
          "group-hover:border-grey-dark group-hover:bg-grey-dark",
        )}
      />
    </>
  );
};

export const getDifficultyIconByChallengeDifficulty = (difficulty: ChallengeDifficulty): ((props: DifficultyProps) => React.ReactElement) => {
  switch (difficulty) {
    case ChallengeDifficulty.Easy:
      return DifficultyEasy;
    case ChallengeDifficulty.Medium:
      return DifficultyMedium;
    case ChallengeDifficulty.Hard:
      return DifficultyHard;
  }
};
