import Card from "app/components/challengePage/Card";
import { ChallengeOverviewFragment, ChallengeStatus } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

interface ChallengeListProps {
  className?: string;
  heading: React.ReactNode;
  challenges: ChallengeOverviewFragment[];
  displayCompleted?: boolean;
}

const ChallengeList: React.FunctionComponent<ChallengeListProps> = ({ className, heading, challenges, displayCompleted = true }) => {
  const numberOfCompletedChallenges = challenges.filter((challenge) => challenge.status === ChallengeStatus.Finished).length;

  return (
    <div className={clsx("mt-2 mb-6", className)}>
      <div className={clsx("mb-6 flex flex-row items-center")}>
        <h2 className={clsx("mb-0 flex items-center text-grey font-bold leading-10", "h4")}>{heading}</h2>
        {displayCompleted === true && (
          <p className={clsx("ml-4 mb-0 text-grey font-normal", "h4")}>
            <span className="sr-only">{`${numberOfCompletedChallenges} of ${challenges.length} challenges completed`}</span>
            <span aria-hidden>{`(${numberOfCompletedChallenges}/${challenges.length})`}</span>
          </p>
        )}
      </div>
      <ul className={clsx("flex flex-row flex-wrap gap-x-12", "sm:gap-x-8", "md:gap-x-14", "xl:gap-x-24")}>
        {challenges.map((challenge) => (
          <li key={challenge.id} className="w-full sm:w-auto">
            <Card
              isMobileFriendly={challenge.isMobileFriendly}
              key={challenge.id}
              className={clsx("mb-12")}
              challengeSlug={challenge.slug}
              heading={challenge.name}
              levels={challenge.numberOfLevels}
              finishedLevels={challenge.numberOfFinishedLevels}
              difficulty={challenge.difficulty}
              challengeStatus={challenge.status}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeList;
