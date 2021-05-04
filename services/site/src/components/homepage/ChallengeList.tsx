import Card from "app/components/homepage/Card";
import { DifficultyLevel } from "app/components/homepage/Card";
import { ChallengeOverviewFragment } from "app/generated/graphql";
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
    <div className={`${className} flex flex-col items-start my-5`}>
      <div className="flex flex-row justify-center items-baseline mx-4 mb-6">
        <h3 className="flex items-center text-primary font-bold leading-10 mb-2">{heading}</h3>
        <p className="text-primary h3 ml-4">
          ({completedLevel}/{openLevel})
        </p>
      </div>
      <ul className="flex">{getChallenges}</ul>
    </div>
  );
};

export default ChallengeList;
