import { ApolloError } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, waitFor } from "@testing-library/react";
import ChallengeCompletedFlashMessage from "app/components/challenge/ChallengeCompletedFlashMessage";
import { CompleteEvaluationButton } from "app/components/evaluation/CompleteEvaluationButton";
import EvaluationBody from "app/components/evaluation/EvaluationBody";
import EvaluationHeader from "app/components/evaluation/EvaluationHeader";
import LoadingScreen from "app/components/evaluation/LoadingScreen";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import { LottieProps } from "app/components/Lottie";
import { ChallengeBySlugDocument, CurrentUserDocument, ResultStatus } from "app/generated/graphql";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import Evaluation, { getServerSideProps } from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import { mount, ReactWrapper } from "enzyme";
import { GraphQLError } from "graphql";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("app/components/Lottie", () => (): React.FunctionComponent<LottieProps> => {
  return null;
});

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

jest.mock("app/hooks/sessionState/useSessionState", () => ({
  useSessionState: jest.fn(),
}));

jest.mock("app/components/evaluation/usePollSubmissionResult", () => ({
  usePollSubmissionResult: jest.fn(),
}));

jest.mock("app/lib/apollo-client", () => ({
  initializeApollo: (_, context) => context.apolloClient,
}));

const mockShowFlashMessage = jest.fn();
jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: () => ({
    show: mockShowFlashMessage,
  }),
}));

const mockChallengeName = "Mock Challenge Name";
const mockChallengeSlug = "mock-slug";
const mockNthLevel = "2";
const mockSubmissionId = "ca9ebfd8-5220-4a5d-8e45-05e95f521e15";

const mocks: MockedResponse[] = [
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: {
          __typename: "User",
          id: "a3db1fc5-7183-42ad-8ba7-fff2922a1927",
          displayName: "Name",
          isRegistered: false,
          isVerified: false,
        },
      },
    },
  },
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

  (useSessionState as jest.Mock).mockImplementation(() => [1, jest.fn()]);

  (usePollSubmissionResult as jest.Mock).mockImplementation(() => ({ status: ResultStatus.Success, requirements: [], totalScore: 100 }));
});

afterEach(() => {
  jest.resetAllMocks();
});

const mountEvaluationPage = (): ReactWrapper => {
  return mount(
    <MockedProvider mocks={mocks}>
      <Evaluation />
    </MockedProvider>,
  );
};

const resolveGraphQLQuery = async (wrapper: ReactWrapper): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();
  });
};

describe("Evaluation", () => {
  describe("page", () => {
    it("renders the loading screen", async () => {
      const wrapper = mountEvaluationPage();

      await act(async () => {
        wrapper.update();
      });

      expect(wrapper.exists(LoadingScreen)).toBeTruthy();
    });

    it("renders the head", async () => {
      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(wrapper.exists(Head)).toBeTruthy();
    });

    it("renders all wrapper elements", async () => {
      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(wrapper.exists("main")).toBeTruthy();
    });

    it("renders the `EvaluationHeader`", async () => {
      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(wrapper.exists(EvaluationHeader)).toBeTruthy();
    });

    it("renders the `EvaluationBody`", async () => {
      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(wrapper.exists(EvaluationBody)).toBeTruthy();
    });

    it("renders the `CompleteEvaluationButton`", async () => {
      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(wrapper.exists(CompleteEvaluationButton)).toBeTruthy();
    });

    it("sets failedLevelsInARow to 0 if status = Success", async () => {
      (usePollSubmissionResult as jest.Mock).mockReturnValue({ status: ResultStatus.Success, requirements: [], totalScore: 100 });

      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);
      await waitFor(() => expect(mockShowFlashMessage).toHaveBeenCalledWith(<ChallengeCompletedFlashMessage />));
    });

    it("shows success flash massage if is success and last level", async () => {
      (useSessionState as jest.Mock).mockReturnValue([0, jest.fn()]);
      (usePollSubmissionResult as jest.Mock).mockReturnValue({ status: ResultStatus.Success, requirements: [], totalScore: 100 });

      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(useSessionState("")[1]).toHaveBeenCalledWith(0);
    });

    it("passes state update function to setFailedLevelsInARow if status = Fail", async () => {
      (useSessionState as jest.Mock).mockReturnValue([1, jest.fn()]);
      (usePollSubmissionResult as jest.Mock).mockReturnValue({ status: ResultStatus.Fail, requirements: [], totalScore: 100 });

      const wrapper = mountEvaluationPage();
      await resolveGraphQLQuery(wrapper);

      expect(useSessionState("")[1]).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("getServerSideProps", () => {
    it("returns initial props", async () => {
      const apolloClient = {
        query: jest
          .fn()
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({
            data: { challenge: { id: 12 } },
          })
          .mockResolvedValueOnce({
            data: { resultForSubmission: { id: 1234 } },
          }),
        cache: { extract: jest.fn() },
      };

      const result: any = await getServerSideProps({
        apolloClient,
        params: { challengeSlug: "challenge-1", nthLevel: "4", submissionId: "valid-uuid" },
      } as unknown as GetServerSidePropsContext);

      expect(result.props).toBeTruthy();
    });

    it("returns 404 if the result was not found", async () => {
      const apolloClient = {
        query: jest
          .fn()
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({
            data: { challenge: { id: 12 } },
          })
          .mockResolvedValueOnce({
            data: { resultForSubmission: null },
          }),
        cache: { extract: jest.fn() },
      };

      const result: any = await getServerSideProps({
        apolloClient,
        params: { challengeSlug: "challenge-1", nthLevel: "4", submissionId: "unknown-uuid" },
      } as unknown as GetServerSidePropsContext);

      expect(result.notFound).toBeTruthy();
    });

    it("returns 404 if the challenge was not found", async () => {
      const apolloClient = {
        query: jest
          .fn()
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({
            data: { challenge: null },
          })
          .mockResolvedValueOnce({
            data: { resultForSubmission: { id: 1234 } },
          }),
        cache: { extract: jest.fn() },
      };

      const result: any = await getServerSideProps({
        apolloClient,
        params: { challengeSlug: "challenge-1", nthLevel: "4", submissionId: "unknown-uuid" },
      } as unknown as GetServerSidePropsContext);

      expect(result.notFound).toBeTruthy();
    });

    it("returns 404 if querying the result resulted in a BAD_USER_INPUT error", async () => {
      const apolloClient = {
        query: jest
          .fn()
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({
            data: { challenge: { id: 12 } },
          })
          .mockRejectedValueOnce(
            new ApolloError({
              graphQLErrors: [{ extensions: { code: "BAD_USER_INPUT" } } as unknown as GraphQLError],
            }),
          ),
        cache: { extract: jest.fn() },
      };

      const result: any = await getServerSideProps({
        apolloClient,
        params: { challengeSlug: "challenge-1", nthLevel: "4", submissionId: "unknown-uuid" },
      } as unknown as GetServerSidePropsContext);

      expect(result.notFound).toBeTruthy();
    });
  });
});
