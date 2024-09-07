import clsx from "clsx";
import React from "react";

export interface ChallengeHeaderProps {
  className?: string;
}

const ChallengeHeader: React.FunctionComponent<ChallengeHeaderProps> = ({ className }) => {
  return (
    <div className={clsx("my-4 flex flex-row justify-between", "md:my-8", className)}>
      <div className={clsx("flex flex-col")}>
        <h1 className={clsx("pb-2.5 text-grey", "h3", "sm:h2")}>Challenges</h1>
        <p className={clsx("text-grey ml-1")}>Pick a challenge from below</p>
      </div>
    </div>
  );
};

export default ChallengeHeader;
