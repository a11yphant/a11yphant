import ButtonLoading from "app/components/buttons/ButtonLoading";
import { ResultStatus } from "app/generated/graphql";
import { EvaluationRouterParams } from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";

interface CompleteEvaluationButtonProps {
  status: ResultStatus;
  isLastLevel: boolean;
  className?: string;
  disabled?: boolean;
}

export const CompleteEvaluationButton = ({ status, isLastLevel, className, disabled }: CompleteEvaluationButtonProps): React.ReactElement => {
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
        className={clsx("px-10", disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary", className)}
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
        className={clsx("px-10", disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary", className)}
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
        className={clsx("px-10", disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary", className)}
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Next Level
      </ButtonLoading>
    );
  }
};
