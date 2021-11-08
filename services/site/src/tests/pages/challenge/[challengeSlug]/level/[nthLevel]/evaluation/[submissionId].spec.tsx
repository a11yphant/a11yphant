import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, cleanup } from "@testing-library/react";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import { LottieProps } from "app/components/Lottie";
import { ChallengeBySlugDocument } from "app/generated/graphql";
import Evaluation from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import { mount, ReactWrapper } from "enzyme";
import Head from "next/head";
import router from "next/router";
import React from "react";

afterEach(cleanup);

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("app/components/Lottie", () => (): React.FunctionComponent<LottieProps> => {
  return null;
});
jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));
jest.mock("app/components/evaluation/usePollSubmissionResult", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ResultStatus } = require("app/generated/graphql");

  return {
    usePollSubmissionResult: () => ({ status: ResultStatus.Success, requirements: [], totalScore: 100 }),
  };
});

const mockChallengeName = "Mock Challenge Name";
const mockChallengeSlug = "mock-slug";
const mockNthLevel = "2";
const mockSubmissionId = "ca9ebfd8-5220-4a5d-8e45-05e95f521e15";

const mocks: MockedResponse[] = [
  {
    request: {
      query: ChallengeBySlugDocument,
      variables: {
        slug: mockChallengeSlug,
      },
    },
    result: {
      data: {
        challenge: {
          __typename: "Challenge",
          id: "a3db1fc5-7183-42ad-8ba7-fff2922a1927",
          name: mockChallengeName,
          levels: [
            {
              __typename: "Level",
              id: "628e7fa6-b0f1-4a19-85b2-ec6a3613ceff",
            },
            {
              __typename: "Level",
              id: "1b1efb0e-6d5b-4640-b86f-4c2b6f8e71d2",
            },
          ],
        },
      },
    },
  },
];

beforeEach(() => {
  router.query = {
    challengeSlug: mockChallengeSlug,
    nthLevel: mockNthLevel,
    submissionId: mockSubmissionId,
  };
});

describe("Evaluation", () => {
  let wrapper: ReactWrapper;
  beforeEach(async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Evaluation />
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });
  });

  it("renders loading screen", async () => {
    // override wrapper from beforeEach because
    // we don't want the query to resolve
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Evaluation />
      </MockedProvider>,
    );

    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.exists(LoadingScreen)).toBeTruthy();
  });

  it("renders head", async () => {
    expect(wrapper.exists(Head)).toBeTruthy();

    // couldn't find a way to test `title` and its content since
    // the children of `Head` aren't actually rendered but injected into `<head>`
  });

  it("renders wrapper elements", async () => {
    expect(wrapper.exists("main")).toBeTruthy();
  });

  it("renders EvaluationHeader", async () => {
    expect(wrapper.exists(EvaluationHeader)).toBeTruthy();
  });

  it("renders EvaluationBody", async () => {
    expect(wrapper.exists(EvaluationBody)).toBeTruthy();
  });

  it("renders EvaluationBody", async () => {
    expect(wrapper.exists(CompleteEvaluationButton)).toBeTruthy();
  });
});
