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
}

export const ChallengeModalLevelCard = ({
  challengeSlug,
  levelNumber,
  status,
  isFirstUnfinishedLevel,
}: ChallengeModalLevelCardProps): React.ReactElement => {
  return (
    <Link
      href={`/challenge/${challengeSlug}/level/${Number(levelNumber).toLocaleString("de-AT", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`}
    >
      <a
        className={clsx(
          "border border-solid rounded-lg",
          !isFirstUnfinishedLevel && "border-grey-dark",
          "px-4 py-3",
          "w-52 h-16",
          isFirstUnfinishedLevel && "border-primary bg-primary",
          "relative",
          "hover:bg-primary-dark hover:border-primary-dark",
          "focus:bg-primary-dark focus:border-primary-dark",
        )}
      >
        <h3 className="text-base">
          Level{" "}
          {Number(levelNumber).toLocaleString("de-AT", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </h3>
        {status === LevelStatus.Finished && <Check className={clsx("h-7 w-10", "absolute top-4 right-5", "text-white")} />}
      </a>
    </Link>
  );
};
