import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ICardProps {
  className?: string;
  heading: string;
  difficulty: DifficultyLevel;
  levels: number;
  challengeSlug: string;
}

export enum DifficultyLevel {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

const Card: React.FunctionComponent<ICardProps> = ({ className, heading, levels, difficulty, challengeSlug }) => {
  const displayGradient = React.useMemo(() => {
    if (difficulty == DifficultyLevel.easy) {
      return <Image src="/images/01_easy.jpg" alt="" width="500" height="500" />;
    } else if (difficulty == DifficultyLevel.medium) {
      return <Image src="/images/02_medium.jpg" alt="" width="500" height="500" />;
    } else if (difficulty == DifficultyLevel.hard) {
      return <Image src="/images/03_hard.jpg" alt="" width="500" height="500" />;
    }
  }, [difficulty]);

  return (
    <li
      className={clsx(
        "relative overflow-hidden w-64 h-64 border-2 border-background bg-backgroundMiddle rounded-xl flex flex-col justify-end",
        "group transition duration-300 hover:bg-grey",
        className,
        "card box-shadow",
      )}
    >
      {displayGradient}
      <div className="p-4">
        <h4 className="w-full">
          {/* TODO: Link to Info Pop-Up when implemented */}
          <Link href={`/challenge/${challengeSlug}/level/01`}>
            <a className={clsx("h6", "border-transparent transition duration-300", "group-hover:text-greyDark group-hover:border-transparent")}>
              {heading}
            </a>
          </Link>
        </h4>
        <div className="w-full mt-2 text-greyMiddle flex justify-between">
          <p className={clsx("m-0 text-greyMiddle transition duration-300", "group-hover:text-greyDark")}>
            {levels <= 1 ? `${levels} Level` : `${levels} Levels`}
          </p>
          <div className="flex">
            <div
              className={clsx(
                "w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey ml-4 transition duration-300",
                "group-hover:border-greyDark group-hover:bg-greyDark",
              )}
            />
            <div
              className={clsx(
                "w-2.5 h-4/5 border-2 rounded-sm border-grey ml-1 transition duration-300",
                "group-hover:border-greyDark",
                difficulty != DifficultyLevel.easy && "bg-grey group-hover:bg-greyDark",
              )}
            />
            <div
              className={clsx(
                "w-2.5 h-4/5 border-2 rounded-sm border-grey ml-1 transition duration-300",
                "group-hover:border-greyDark",
                difficulty == DifficultyLevel.hard && "bg-grey group-hover:bg-greyDark",
              )}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default Card;
