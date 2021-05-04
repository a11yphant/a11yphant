import Card from "app/components/homepage/Card";
import { DifficultyLevel } from "app/components/homepage/Card";
import { ChallengeOverviewFragment } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

interface ChallengeListProps {
  className?: string;
  heading: React.ReactNode;
  completedLevel: number;
  openLevel: number;
  challenges: ChallengeOverviewFragment[];
}

const ChallengeList: React.FunctionComponent<ChallengeListProps> = ({ className, heading, completedLevel, openLevel, challenges }) => {
  // render challenges
  const getChallenges = React.useMemo(
    () =>
      challenges.map((challenge, idx) => {
        // TODO: load difficulty from API
        return (
          <Card
            key={challenge.id}
            className="mr-24"
            challengeSlug={challenge.slug}
            heading={challenge.name}
            levels={challenge.levels.length}
            difficulty={DifficultyLevel.easy}
          />
        );
      }),
    [challenges],
  );

  return (
    <div className={clsx("flex flex-col items-start mt-2 mb-6", className)}>
      <div className="flex flex-row items-center mx-4 mb-6">
        <h3 className={clsx("flex items-center text-grey font-bold leading-10 mb-0", "h4")}>
          <span className="sr-only">Difficulty </span>
          {heading}
        </h3>
        <p className={clsx("text-grey ml-4 mb-0", "h4 font-normal")} aria-hidden="true">
          {`(${completedLevel}/${openLevel})`}
        </p>
        <p className="sr-only">{`${completedLevel} of ${openLevel} challenges completed`}</p>
      </div>
      <ul className="flex">{getChallenges}</ul>
    </div>
  );
};

export default ChallengeList;
