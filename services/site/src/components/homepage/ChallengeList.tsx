import Card from "app/components/homepage/Card";
import { DifficultyLevel } from "app/components/homepage/Card";
import React from "react";

interface ChallengeListProps {
  className?: string;
  heading: React.ReactNode;
  completedLevel: number;
  openLevel: number;
}

const ChallengeList: React.FunctionComponent<ChallengeListProps> = ({ className, heading, completedLevel, openLevel }) => {
  return (
    <div className={`${className} flex flex-col items-start my-5`}>
      <div className="flex flex-row justify-center items-baseline mx-4 mb-6">
        <h3 className="flex items-center text-primary font-bold leading-10 mb-2">{heading}</h3>
        <p className="text-primary h3 ml-4">
          ({completedLevel}/{openLevel})
        </p>
      </div>
      <div className="flex">
        <Card className="mr-24" heading="HTML Basics" levels={12} difficulty={DifficultyLevel.easy} />
        <Card className="mr-24" heading="Semantic HTML" levels={8} difficulty={DifficultyLevel.hard} />
      </div>
    </div>
  );
};

export default ChallengeList;
