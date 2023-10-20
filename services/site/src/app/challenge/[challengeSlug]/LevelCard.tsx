import Check from "app/components/icons/Check";
import { LevelStatus } from "app/generated/graphql";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface LevelCardProps {
  challengeSlug: string;
  levelNumber: number;
  status: LevelStatus;
  isFirstUnfinishedLevel: boolean;
  type: string;
}

export const LevelCard = ({ challengeSlug, levelNumber, status, isFirstUnfinishedLevel, type }: LevelCardProps): React.ReactElement => {
  return (
    <Link
      href={`/challenge/${challengeSlug}/level/${String(levelNumber).padStart(2, "0")}`}
      className={clsx(
        "relative border border-solid rounded-lg",
        !isFirstUnfinishedLevel && "border-grey-dark",
        "px-4 py-3",
        "w-full h-18",
        isFirstUnfinishedLevel && "border-primary bg-primary",
        "relative",
        "hover:bg-primary-dark hover:border-primary-dark",
      )}
    >
      <span className={clsx("h3 text-base text-grey block")}>Level {String(levelNumber).padStart(2, "0")}</span>

      <span className="font-normal text-grey-middle mb-0 block">{type === "QuizLevel" ? "Quiz" : "Coding"}</span>
      {status === LevelStatus.Finished && <Check className={clsx("h-7 w-10 absolute top-4 right-5 text-light")} />}
    </Link>
  );
};
