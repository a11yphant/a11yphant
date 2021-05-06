import clsx from "clsx";
import React from "react";

interface ChallengeHeaderProps {
  className?: string;
}

const ChallengeHeader: React.FunctionComponent<ChallengeHeaderProps> = ({ className }) => {
  return (
    <div className={clsx("flex flex-row my-8", className)}>
      <div className="flex flex-col">
        <h2 className="text-grey pb-2.5">Challenges</h2>
        <p className="text-greyMiddle">Pick a challenge from below</p>
      </div>
    </div>
  );
};

export default ChallengeHeader;
