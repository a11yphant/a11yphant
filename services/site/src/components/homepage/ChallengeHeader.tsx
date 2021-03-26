import React from "react";

interface ChallengeHeaderProps {
  className?: string;
}

const ChallengeHeader: React.FunctionComponent<ChallengeHeaderProps> = ({ className }) => {
  return (
    <div className={`${className} flex flex-row justify-between items-center box-border my-8 w-full`}>
      <div className="flex flex-col">
        <h2 className="text-primary font-bold leading-10 pb-2">Challenges</h2>
        <p className="text-primary">Pick a challenge from below</p>
      </div>
    </div>
  );
};

export default ChallengeHeader;
