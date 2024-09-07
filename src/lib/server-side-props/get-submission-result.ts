import { ApolloQueryResult } from "@apollo/client";
import {
  EvaluationRequirementResultFragment,
  ResultForSubmissionDocument,
  ResultForSubmissionQuery,
  ResultForSubmissionQueryVariables,
  ResultStatus,
} from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";

export interface CustomSubmissionResult {
  status: ResultStatus;
  requirements: EvaluationRequirementResultFragment[];
  totalScore: number;
}

export async function getSubmissionResult(submissionId: string): Promise<CustomSubmissionResult> {
  const client = getApolloClient();

  let response: ApolloQueryResult<ResultForSubmissionQuery>;
  do {
    response = await client.query<ResultForSubmissionQuery, ResultForSubmissionQueryVariables>({
      query: ResultForSubmissionDocument,
      variables: { id: submissionId },
    });
  } while (response.data.resultForSubmission?.status === ResultStatus.Pending);

  const result = response.data.resultForSubmission;

  const failedChecks = result.numberOfFailedRequirementChecks;
  const totalChecks = result.numberOfCheckedRequirements;
  const totalScore = 100 - (failedChecks / totalChecks) * 100;

  return {
    status: result.status,
    requirements: result.requirements,
    totalScore,
  };
}
