import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import { SaveFailedLevelsInSessionStorage } from "app/components/evaluation/SaveFailedLevelsInSessionStorage";
import { ResultStatus } from "app/generated/graphql";
import { Challenge } from "app/lib/server-side-props/get-challenge";
import { CustomSubmissionResult } from "app/lib/server-side-props/get-submission-result";
import clsx from "clsx";
import React from "react";

export interface EvaluationResultProps {
  challenge: Challenge;
  challengeSlug: string;
  nthLevel: number;
  submissionResult: CustomSubmissionResult;
  isLastLevel: boolean;
}

export const EvaluationResult = ({ challenge, challengeSlug, nthLevel, submissionResult, isLastLevel }: EvaluationResultProps): JSX.Element => {
  return (
    <>
      <EvaluationHeader
        className={clsx("flex")}
        challengeName={challenge.name}
        levelIdx={nthLevel}
        score={submissionResult.totalScore}
        passed={submissionResult.status === ResultStatus.Success}
      />
      <ScrollOverlayWrapper
        className={clsx("h-full max-w-7xl m-auto pt-8 lg:pt-20 mt-0 mb-4 flex flex-col items-left w-full box-border overflow-auto overscroll-none")}
        classNameBottomOverlay={"w-full h-52 shrink-0 -mt-52"}
        enableTopOverlay={false}
      >
        <EvaluationBody requirements={submissionResult.requirements} />
      </ScrollOverlayWrapper>
      <div className={clsx("mb-8 flex lg:absolute lg:bottom-4 lg:right-4 lg:block")}>
        <CompleteEvaluationButton status={submissionResult.status} isLastLevel={isLastLevel} />
      </div>
      <SaveFailedLevelsInSessionStorage status={submissionResult.status} nthLevel={nthLevel} challengeSlug={challengeSlug} />
    </>
  );
};
