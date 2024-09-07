import { EvaluationRequirementResultFragment, ResultStatus, useResultForSubmissionLazyQuery } from "app/generated/graphql";
import React from "react";

export interface CustomSubmissionResult {
  status: ResultStatus;
  requirements: EvaluationRequirementResultFragment[];
  totalScore: number;
}

export const usePollSubmissionResult = (submissionId: string): CustomSubmissionResult | undefined => {
  const [queryInterval, setQueryInterval] = React.useState<NodeJS.Timeout | undefined>();
  const [totalScore, setTotalScore] = React.useState<number>(0);

  const [getResultForSubmission, { data, loading }] = useResultForSubmissionLazyQuery({ fetchPolicy: "network-only" });
  const status = data?.resultForSubmission?.status;
  const failedChecks = data?.resultForSubmission?.numberOfFailedRequirementChecks;
  const totalChecks = data?.resultForSubmission?.numberOfCheckedRequirements;
  const requirements = data?.resultForSubmission?.requirements || [];

  // poll the submission result every 3 seconds
  React.useEffect(() => {
    // initial poll
    getResultForSubmission({ variables: { id: submissionId as string } });

    const interval = setInterval(() => {
      getResultForSubmission({ variables: { id: submissionId as string } });
    }, 500);

    setQueryInterval(interval);
  }, []);

  // stop fetch when status is not PENDING anymore
  React.useEffect(() => {
    if (status && status !== ResultStatus.Pending) {
      clearInterval(queryInterval);
    }
  }, [status, queryInterval]);

  React.useEffect(() => {
    if (failedChecks !== undefined && totalChecks !== undefined) {
      setTotalScore(100 - (failedChecks / totalChecks) * 100);
    }
  }, [failedChecks, totalChecks]);

  if (loading || data?.resultForSubmission === undefined || status === ResultStatus.Pending) {
    return undefined;
  } else {
    return {
      status,
      requirements,
      totalScore,
    };
  }
};
