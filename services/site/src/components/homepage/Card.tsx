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
          {/* TODO: Link to Info Pop-Up when implemented */}
          {/*<Link href="/challenge/[challengeSlug]" as={`/challenge/${challengeSlug}`} shallow={true}>*/}
          <Link href={`?challenge=${challengeSlug}`} shallow={true}>
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
            <div
              className={clsx(
                "w-2.5 h-4/5 ml-4 border-2 rounded-sm border-grey bg-grey",
                "transition duration-300",
                "group-hover:border-grey-dark group-hover:bg-grey-dark",
              )}
            />
            <div
              className={clsx(
                "w-2.5 h-4/5 border-2 rounded-sm border-grey ml-1",
                "transition duration-300",
                "group-hover:border-grey-dark",
                difficulty !== ChallengeDifficulty.Easy && "bg-grey group-hover:bg-grey-dark",
              )}
            />
            <div
              className={clsx(
                "w-2.5 h-4/5 border-2 rounded-sm border-grey ml-1",
                "transition duration-300",
                "group-hover:border-grey-dark",
                difficulty === ChallengeDifficulty.Hard && "bg-grey group-hover:bg-grey-dark",
              )}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default Card;
