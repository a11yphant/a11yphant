import React from "react";

interface ChallengeListProps {
  className?: string;
  heading: React.ReactNode;
  completedLevel: number;
  openLevel: number;
}

const ChallengeList: React.FunctionComponent<ChallengeListProps> = ({ className, heading, completedLevel, openLevel }) => {
  return (
    <div className={`${className} flex flex-row justify-between items-center box-border my-8 w-full `}>
      <div className="flex flex-row justify-center items-baseline">
        <h3 className="flex items-center text-primary font-bold leading-10 mb-2">{heading}</h3>
        <p className="text-primary h3 ml-4">
          ({completedLevel}/{openLevel})
        </p>
      </div>
    </div>
  );
};

export default ChallengeList;
