import "@testing-library/jest-dom/extend-expect";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { cleanup } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import { RequirementStatus, ResultForSubmissionDocument, ResultStatus } from "app/generated/graphql";
import React from "react";

afterEach(cleanup);

const submissionId = "6e19e948-e022-4167-a82c-423feaf0d03a";
const mockRequirements = [
  {
    __typename: "RequirementResult",
    id: "558b7e40-0b80-43ac-8dad-b85ab557cd47",
    title: "Mock Title 1",
    description: "Mock Description 1",
    result: RequirementStatus.Success,
    rule: {
      __typename: "Rule",
      id: "e21cb632-0edd-4094-aab3-08de5af67696",
      key: "mock-rule-1",
    },
  },
  {
    __typename: "RequirementResult",
    id: "86ddacfc-0a1a-4b3e-af08-00b5c2510070",
    title: "Mock Title 2",
    description: "Mock Description 2",
    result: RequirementStatus.Fail,
    rule: {
      __typename: "Rule",
      id: "ef86682e-32a4-47de-9ae6-e4a4e2b360b2",
      key: "mock-rule-2",
    },
  },
];

const mocks: MockedResponse[] = [
  {
    request: {
      query: ResultForSubmissionDocument,
      variables: {
        id: submissionId,
      },
    },
    result: {
      data: {
        resultForSubmission: {
          __typename: "Result",
          id: submissionId,
          status: ResultStatus.Fail,
          numberOfCheckedRequirements: 2,
          numberOfFailedRequirementChecks: 1,
          requirements: mockRequirements,
        },
      },
    },
  },
];

const wrapper: React.FunctionComponent = ({ children }) => {
  return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
};

describe("usePollSubmissionResult", () => {
  it("returns correct status, requirements and totalScore", async () => {
    jest.useFakeTimers();

    const { result, waitForNextUpdate } = renderHook(() => usePollSubmissionResult(submissionId), { wrapper });
    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current).toBe(undefined);

    // make apollo return mocked response
    jest.advanceTimersByTime(0);
    await waitForNextUpdate();

    expect(result.current.status).toBe(ResultStatus.Fail);
    expect(result.current.requirements).toEqual(mockRequirements);
    expect(result.current.totalScore).toBe(50);
  });
});
