import { ChallengeStatus as ChallengeStatusEnum, ChallengesWithStatusForUserQuery } from "app/generated/graphql";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

import Check from "../icons/Check";

export interface ChallengeStatusProps {
  id: string;
  challenges: ChallengesWithStatusForUserQuery["challenges"];
  challengeStatus: ChallengeStatusEnum;
}

const ChallengeStatus: React.FunctionComponent<ChallengeStatusProps> = ({ id, challenges, challengeStatus }) => {
  return (
    <>
      <h3 id={id} className={clsx("mb-2.5", "h5 font-medium", "sm:h4 sm:font-medium")}>
        {challengeStatus === ChallengeStatusEnum.Finished && "Completed"}
        {challengeStatus === ChallengeStatusEnum.InProgress && "Currently solving"}
        {challengeStatus === ChallengeStatusEnum.Open && "Not started yet"}
      </h3>

      <ul className="gap-4 pt-2 mb-10 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {challenges.map(
          (challenge) =>
            challenge.statusForUser === challengeStatus && (
              <li key={challenge.id} className={clsx("m-0 p-0")}>
                <Link
                  href={`/challenges/${challenge.slug}`}
                  className={clsx(
                    "relative block border border-solid rounded-lg w-full h-18",
                    "group hover:bg-primary-dark hover:border-primary-dark",
                    challengeStatus === ChallengeStatusEnum.Finished && "border-primary bg-primary",
                    challengeStatus === ChallengeStatusEnum.InProgress && "border-grey-light",
                    challengeStatus === ChallengeStatusEnum.Open && "border-grey-dark",
                  )}
                >
                  <span className={clsx("font-normal mb-0 block px-4 py-3", "text-white")} aria-label={`Challenge: ${challenge.name}`}>
                    {challenge.name}
                  </span>
                  {challengeStatus !== ChallengeStatusEnum.Finished && (
                    <div
                      className={clsx(
                        "w-full h-fit-content border-t border-solid rounded-bl-lg rounded-br-lg",
                        challengeStatus === ChallengeStatusEnum.InProgress && "border-grey-light bg-primary-dark",
                        challengeStatus === ChallengeStatusEnum.Open &&
                          "border-grey-dark group-hover:border-grey-middle motion-safe:transition-colors transition-300",
                      )}
                    >
                      <span
                        className={clsx(
                          "font-normal text-sm text-right py-1 px-2 block",
                          "text-grey-light group-hover:text-white motion-safe:transition-colors transition-300",
                        )}
                      >
                        <span className="sr-only"> - </span>
                        {(challenge.numberOfFinishedLevels / challenge.numberOfLevels) * 100}% completed
                      </span>
                    </div>
                  )}
                  {challengeStatus === ChallengeStatusEnum.Finished && (
                    <>
                      <span className="sr-only"> - completed</span>
                      <Check className="h-4 w-10 absolute top-4 right-5 text-grey-light" />
                    </>
                  )}
                </Link>
              </li>
            ),
        )}
      </ul>
    </>
  );
};

export default ChallengeStatus;
