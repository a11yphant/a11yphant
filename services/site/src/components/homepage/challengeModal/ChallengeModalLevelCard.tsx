import Check from "app/components/icons/Check";
import { LevelStatus } from "app/generated/graphql";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface ChallengeModalLevelCardProps {
  challengeSlug: string;
  levelNumber: number;
  status: LevelStatus;
  isFirstUnfinishedLevel: boolean;
  type: string;
}

export const ChallengeModalLevelCard = ({
  challengeSlug,
  levelNumber,
  status,
  isFirstUnfinishedLevel,
  type,
}: ChallengeModalLevelCardProps): React.ReactElement => {
  return (
    <Link
      href={`/challenge/${challengeSlug}/level/${Number(levelNumber).toLocaleString("de-AT", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`}
      className={clsx(
        "border border-solid rounded-lg",
        !isFirstUnfinishedLevel && "border-grey-dark",
        "px-4 py-3",
        "w-full h-18",
        isFirstUnfinishedLevel && "border-primary bg-primary",
        "relative",
        "hover:bg-primary-dark hover:border-primary-dark",
      )}
    >
      <h3 className={clsx("text-base")}>
        Level{" "}
        {Number(levelNumber).toLocaleString("de-AT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </h3>

      <p className="font-normal text-grey-middle mb-0">{type == "QuizLevel" ? "Quiz" : "Coding"}</p>
      {status === LevelStatus.Finished && <Check className={clsx("h-7 w-10 absolute top-4 right-5 text-light")} />}
    </Link>
  );
};
