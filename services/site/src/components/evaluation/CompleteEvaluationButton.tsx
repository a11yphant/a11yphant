import ButtonLoading from "app/components/buttons/ButtonLoading";
import { ResultStatus } from "app/generated/graphql";
import { EvaluationRouterParams } from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import { useRouter } from "next/router";
import React from "react";

interface CompleteEvaluationButtonProps {
  status: ResultStatus;
  isLastLevel: boolean;
}

export const CompleteEvaluationButton = ({ status, isLastLevel }: CompleteEvaluationButtonProps): React.ReactElement => {
  const router = useRouter();
  const { challengeSlug, nthLevel }: EvaluationRouterParams = router.query;

  const [loadingAnimation, setLoadingAnimation] = React.useState(false);

  if (status === ResultStatus.Fail) {
    return (
      <ButtonLoading
        primary
        onClick={() => {
          setLoadingAnimation(true);
          router.back();
        }}
        className="px-10"
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Retry
      </ButtonLoading>
    );
  } else if (isLastLevel) {
    return (
      <ButtonLoading
        onClick={() => {
          router.push("/");
        }}
        primary
        className="px-10"
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Finish Challenge
      </ButtonLoading>
    );
  } else {
    return (
      <ButtonLoading
        onClick={() => {
          const nextLevel = parseInt(nthLevel as string) + 1;
          router.push(`/challenge/${challengeSlug}/level/0${nextLevel}`);
        }}
        primary
        className="px-10"
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Next Level
      </ButtonLoading>
    );
  }
};
