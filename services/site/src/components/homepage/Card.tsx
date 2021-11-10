import { getDifficultyIconByChallengeDifficulty } from "app/components/homepage/difficulties/Difficulties";
import { ChallengeDifficulty } from "app/generated/graphql";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface CardProps {
  className?: string;
  heading: string;
  levels: number;
  difficulty: ChallengeDifficulty;
  challengeSlug: string;
  challengeNumber: number;
}

const Card: React.FunctionComponent<CardProps> = ({ className, heading, levels, difficulty, challengeSlug, challengeNumber }) => {
  const DifficultyIcon = getDifficultyIconByChallengeDifficulty(difficulty);

  return (
    <li
      className={clsx(
        "w-64 h-64 relative overflow-hidden border-0 border-background-light bg-background-light rounded-xl flex flex-col justify-end",
        "group transition duration-300",
        "hover:bg-grey",
        "card shadow-card",
        difficulty === ChallengeDifficulty.Easy && "bg-gradient-easy",
        difficulty === ChallengeDifficulty.Medium && "bg-gradient-medium",
        difficulty === ChallengeDifficulty.Hard && "bg-gradient-hard",
        "bg-no-repeat	bg-contain bg-top",
        className,
      )}
    >
      <div className={clsx("p-4 pt-2 bg-background-light", "transition duration-300", "group-hover:bg-grey")}>
        <h4 className="w-full">
          <span className="sr-only">{`Challenge ${challengeNumber}`}</span>
          <Link href={`/?challenge=${challengeSlug}`} shallow={true}>
            <a className={clsx("border-transparent", "transition duration-300", "group-hover:text-grey-dark group-hover:border-transparent", "h6")}>
              {heading}
            </a>
          </Link>
        </h4>
        <div className="w-full mt-2 text-grey-middle flex justify-between">
          <p className={clsx("m-0 text-grey-middle", "transition duration-300", "group-hover:text-grey-dark")}>
            {levels <= 1 ? `${levels} Level` : `${levels} Levels`}
          </p>
          <p className="sr-only">{`Difficulty ${difficulty}`}</p>
          <div className="flex">
            <DifficultyIcon className={clsx("w-2.5 h-4/5", "transition duration-300")} />
          </div>
        </div>
      </div>
    </li>
  );
};

export default Card;
