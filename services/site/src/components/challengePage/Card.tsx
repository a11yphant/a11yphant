import { getDifficultyIconByChallengeDifficulty } from "app/components/challengePage/difficulties/Difficulties";
import Check from "app/components/icons/Check";
import { ChallengeDifficulty, ChallengeStatus } from "app/generated/graphql";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import CardHeading from "./CardHeading";

export interface CardProps {
  className?: string;
  heading: string;
  levels: number;
  finishedLevels: number;
  difficulty: ChallengeDifficulty;
  challengeSlug: string;
  challengeNumber?: number;
  isMobileFriendly?: boolean;
  isUserFavorite?: boolean;
  isNew?: boolean;
  isTopChallenge?: boolean;
  challengeStatus: ChallengeStatus;
}

const Card: React.FunctionComponent<CardProps> = ({
  className,
  heading,
  levels,
  finishedLevels,
  difficulty,
  challengeSlug,
  challengeNumber,
  isMobileFriendly,
  isUserFavorite,
  isNew,
  isTopChallenge,
  challengeStatus,
}) => {
  const DifficultyIcon = getDifficultyIconByChallengeDifficulty(difficulty);

  return (
    <article
      className={clsx(
        "min-w-full h-64 relative overflow-hidden border-0 border-background-light bg-background-light rounded-xl flex flex-col justify-end",
        "group transition duration-300",
        "card shadow-card gap-0",
        "bg-no-repeat	bg-contain bg-top",
        "xs:min-w-0 xs:w-64",
        difficulty === ChallengeDifficulty.Easy && finishedLevels !== levels && "bg-gradient-easy",
        difficulty === ChallengeDifficulty.Medium && finishedLevels !== levels && "bg-gradient-medium",
        difficulty === ChallengeDifficulty.Hard && finishedLevels !== levels && "bg-gradient-hard",
        className,
      )}
    >
      {isMobileFriendly && (
        <span className="text-dark font-medium px-3 py-0.5 bg-gradient-to-l from-grey-light to-light absolute right-0 top-3 rounded-l-lg shadow-md">
          Mobile friendly
        </span>
      )}

      {isUserFavorite && (
        <span className="text-light font-medium px-3 py-0.5 bg-gradient-to-l bg-primary absolute right-0 top-3 rounded-l-lg shadow-md">
          <span className="sr-only">Loved</span> <span aria-hidden="true">🤍</span> by our community
        </span>
      )}

      {isNew && (
        <span className="text-light font-medium px-3 py-0.5 bg-gradient-to-l bg-primary absolute right-0 top-12 rounded-l-lg shadow-md">New</span>
      )}

      {challengeStatus === ChallengeStatus.InProgress && (
        <div className={clsx("flex-1 flex items-center justify-center")}>
          <p className={clsx("text-background-light font-mono text-6xl mb-0", "transition duration-300", "group-hover:text-grey-dark")}>
            {finishedLevels}/{levels} <span className={clsx("sr-only")}>levels completed</span>
          </p>
        </div>
      )}

      {finishedLevels > 0 && finishedLevels === levels && (
        <div className={clsx("flex-1 flex items-center justify-center bg-background-light")}>
          <Check className={clsx("h-20 text-grey-middle", "transition duration-300", "group-hover:text-grey")} />
        </div>
      )}
      <div className={clsx("p-4 pt-2 bg-background-light", "transition duration-300", "group-hover:bg-grey")}>
        <CardHeading isTopChallenge={isTopChallenge}>
          <Link
            href={`/challenge/${challengeSlug}`}
            shallow={true}
            scroll={false}
            className={clsx("border-transparent", "transition duration-300", "group-hover:text-grey-dark group-hover:border-transparent", "h6")}
          >
            {heading}
          </Link>
        </CardHeading>
        <div className={clsx("w-full mt-2 text-grey-middle flex justify-between")}>
          <p className={clsx("m-0 text-grey-middle", "transition duration-300", "group-hover:text-grey-dark")}>
            {levels <= 1 ? `${levels} Level` : `${levels} Levels`}
          </p>
          <div className={clsx("flex")}>
            <DifficultyIcon className={clsx("w-2.5 h-4/5", "transition duration-300")} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
