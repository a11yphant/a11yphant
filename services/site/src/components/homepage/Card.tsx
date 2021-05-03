import Image from "next/image";
import React from "react";

interface ICardProps {
  className?: string;
  heading: string;
  difficulty: DifficultyLevel;
  levels: number;
}

export enum DifficultyLevel {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

const Card: React.FunctionComponent<ICardProps> = ({ className, heading, levels, difficulty }) => {
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
    <div className={`${className} w-64 h-64 border-2 border-primary rounded-xl flex flex-col justify-end overflow-hidden`}>
      {displayGradient}
      <div className="p-4 bg-white">
        <h4 className="w-full text-primary font-bold">{heading}</h4>
        <div className="w-full mt-2 text-primary">
          <div className="flex justify-between">
            <p className="m-0">{levels <= 1 ? `${levels} Level` : `${levels} Levels`}</p>
            <div className="flex">
              <div className="w-3 h-5 border-2 rounded border-primary bg-primary ml-4" />
              <div className={`w-3 h-5 border-2 rounded border-primary ${difficulty != DifficultyLevel.easy && "bg-primary"} ml-1`} />
              <div className={`w-3 h-5 border-2 rounded border-primary ${difficulty == DifficultyLevel.hard && "bg-primary"} ml-1`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
