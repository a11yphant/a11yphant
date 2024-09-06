import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, renderHook } from "@testing-library/react";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import { RequirementStatus, ResultForSubmissionDocument, ResultStatus } from "app/generated/graphql";
import React from "react";

const mockFailSubmissionId = "6e19e948-e022-4167-a82c-423feaf0d03a";
const mockPendingSubmissionId = "51fc32e4-12a0-4dde-abc4-d3fcf5611351";
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

const getMockedPendingData = jest.fn(() => ({
  data: {
    resultForSubmission: {
      id: mockPendingSubmissionId,
      status: ResultStatus.Pending,
      numberOfCheckedRequirements: 0,
      numberOfFailedRequirementChecks: 0,
      requirements: [],
      __typename: "Result",
    },
  },
}));

const mocks: MockedResponse[] = [
  {
    request: {
      query: ResultForSubmissionDocument,
      variables: {
        id: mockFailSubmissionId,
      },
    },
    result: {
      data: {
        resultForSubmission: {
          __typename: "Result",
          id: mockFailSubmissionId,
          status: ResultStatus.Fail,
          numberOfCheckedRequirements: 2,
          numberOfFailedRequirementChecks: 1,
          requirements: mockRequirements,
        },
      },
    },
  },
  {
    request: {
      query: ResultForSubmissionDocument,
      variables: {
        id: mockPendingSubmissionId,
      },
    },
    newData: getMockedPendingData,
  },
];

async function waitForNextPoll(): Promise<void> {
  await act(async () => {
    jest.advanceTimersByTime(500);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
      jest.advanceTimersToNextTimer();
    });
  });
}

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
};

describe("usePollSubmissionResult", () => {
  it("returns correct status, requirements and totalScore", async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => usePollSubmissionResult(mockFailSubmissionId), { wrapper });
    expect(result.current).toBe(undefined);

    // make apollo return mocked response
    await act(async () => {
      jest.advanceTimersByTime(0);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
        jest.advanceTimersToNextTimer();
      });
    });

    expect(result.current.status).toBe(ResultStatus.Fail);
    expect(result.current.requirements).toEqual(mockRequirements);
    expect(result.current.totalScore).toBe(50);
  });

  it("queries every 3 seconds", async () => {
    jest.useFakeTimers();

    renderHook(() => usePollSubmissionResult(mockPendingSubmissionId), { wrapper });

    // initial call in useEffect
    expect(getMockedPendingData).toHaveBeenCalledTimes(1);

    await waitForNextPoll();
    expect(getMockedPendingData).toHaveBeenCalledTimes(2);

    // call again in interval after another 3 seconds
    await waitForNextPoll();
    expect(getMockedPendingData).toHaveBeenCalledTimes(3);
  });

  it("clears interval after receiving real response", async () => {
    jest.useFakeTimers();
    jest.spyOn(window, "clearInterval");

    renderHook(() => usePollSubmissionResult(mockFailSubmissionId), { wrapper });

    expect(clearInterval).toHaveBeenCalledTimes(0);

    // make apollo return mocked response
    await act(async () => {
      jest.advanceTimersByTime(0);
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
        jest.advanceTimersToNextTimer();
      });
    });

    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});
