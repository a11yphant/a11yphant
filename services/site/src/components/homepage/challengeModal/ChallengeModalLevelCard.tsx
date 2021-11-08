import Check from "app/components/icons/Check";
import { LevelStatus } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

interface ChallengeModalLevelCardProps {
  nthLevel: number;
  status: LevelStatus;
  firstOpenLevel: boolean;
}

export const ChallengeModalLevelCard = ({ nthLevel, status, firstOpenLevel }: ChallengeModalLevelCardProps): React.ReactElement => {
  return (
    <section
      className={clsx(
        "border border-solid border-grey-dark rounded-lg",
        "px-4 py-3",
        "w-52 h-16",
        firstOpenLevel && "border-primary bg-primary",
        "relative",
      )}
    >
      <h3 className="text-base">
        Level{" "}
        {Number(nthLevel).toLocaleString("de-AT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </h3>
      {status === LevelStatus.Finished && <Check className={clsx("h-7 w-10", "absolute top-4 right-5")} />}
    </section>
  );
};
