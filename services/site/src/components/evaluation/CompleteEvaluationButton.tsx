import LoadingButton from "app/components/buttons/LoadingButton";
import { ResultStatus } from "app/generated/graphql";
import { EvaluationRouterParams } from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";

interface CompleteEvaluationButtonProps {
  autoFocus?: boolean;
  status: ResultStatus;
  isLastLevel: boolean;
  className?: string;
  disabled?: boolean;
  onRetry?: () => void;
}

export const CompleteEvaluationButton = ({
  autoFocus,
  status,
  isLastLevel,
  className,
  disabled,
  onRetry,
}: CompleteEvaluationButtonProps): React.ReactElement => {
  const router = useRouter();
  const { challengeSlug, nthLevel }: EvaluationRouterParams = router.query;

  const [loadingAnimation, setLoadingAnimation] = React.useState(false);

  if (status === ResultStatus.Fail) {
    return (
      <LoadingButton
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        primary
        onClick={() => {
          setLoadingAnimation(true);
          if (onRetry) {
            onRetry();
          } else {
            router.back();
          }
        }}
        className={clsx(disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary", className, "ml-auto self-end")}
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Retry
      </LoadingButton>
    );
  } else if (isLastLevel) {
    return (
      <LoadingButton
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onClick={() => {
          router.push("/");
        }}
        primary
        className={clsx(disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary", className, "ml-auto self-end")}
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Finish Challenge
      </LoadingButton>
    );
  } else {
    return (
      <LoadingButton
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onClick={() => {
          const nextLevel = parseInt(nthLevel as string) + 1;
          router.push(`/challenge/${challengeSlug}/level/0${nextLevel}`);
        }}
        primary
        className={clsx(disabled && "opacity-50 cursor-not-allowed hover:bg-primary hover:border-primary", className, "ml-auto self-end")}
        loading={loadingAnimation}
        srTextLoading="The request is being processed."
      >
        Next Level
      </LoadingButton>
    );
  }
};
