import clsx from "clsx";
import React from "react";

interface ChallengeHeaderProps {
  className?: string;
}

const ChallengeHeader: React.FunctionComponent<ChallengeHeaderProps> = ({ className }) => {
  return (
    <div className={clsx("my-8 flex flex-row", className)}>
      <div className={clsx("flex flex-col")}>
        <h2 className={clsx("pb-2.5 text-grey", "h3", "sm:h2")}>Challenges</h2>
        <p className={clsx("text-grey-middle")}>Pick a challenge from below</p>
      </div>
    </div>
  );
};

export default ChallengeHeader;
