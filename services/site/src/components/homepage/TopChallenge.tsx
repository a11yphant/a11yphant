import { ChallengeOverviewFragment } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

import Card from "../challengePage/Card";

interface TopChallengeProps {
  challenge: ChallengeOverviewFragment;
  timesCompleted: string;
  isUserFavorite?: boolean;
  isNew?: boolean;
}
const TopChallenge: React.FunctionComponent<React.PropsWithChildren<TopChallengeProps>> = ({ challenge, timesCompleted, isUserFavorite, isNew }) => {
  return (
    <li className={clsx("px-4 py-4 flex flex-col items-center")}>
      <Card
        isMobileFriendly={challenge.isMobileFriendly}
        isUserFavorite={isUserFavorite}
        isNew={isNew}
        key={challenge.id}
        className={clsx("mb-6 lg:mb-12", "h-56 sm:h-64")}
        challengeSlug={challenge.slug}
        heading={challenge.name}
        levels={challenge.numberOfLevels}
        finishedLevels={challenge.numberOfFinishedLevels}
        difficulty={challenge.difficulty}
        challengeStatus={challenge.status}
        isTopChallenge
      />
      <p className={clsx("block py-1.5 sm:px-4 text-light font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm")}>
        {timesCompleted}+ times completed
      </p>
    </li>
  );
};

export default TopChallenge;
