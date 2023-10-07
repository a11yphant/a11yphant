import { ChallengeOverviewFragment } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";

import Card from "../challengePage/Card";

interface TopChallengeProps {
  challenge: ChallengeOverviewFragment;
  timesCompleted: string;
  userFavorite?: boolean;
}
const TopChallenge: React.FunctionComponent<React.PropsWithChildren<TopChallengeProps>> = ({ challenge, timesCompleted, userFavorite }) => {
  return (
    <div className={clsx("px-4 flex flex-col items-center")}>
      <Card
        isMobileFriendly={challenge.isMobileFriendly}
        isUserFavorite={userFavorite}
        key={challenge.id}
        className={clsx("mb-12")}
        challengeSlug={challenge.slug}
        heading={challenge.name}
        levels={challenge.numberOfLevels}
        finishedLevels={challenge.numberOfFinishedLevels}
        difficulty={challenge.difficulty}
        challengeStatus={challenge.status}
      />
      <p className={clsx("block py-1.5 px-4 text-light font-medium not-italic uppercase tracking-[0.18rem] text-center text-sm")}>
        {timesCompleted}+ times completed
      </p>
    </div>
  );
};

export default TopChallenge;
