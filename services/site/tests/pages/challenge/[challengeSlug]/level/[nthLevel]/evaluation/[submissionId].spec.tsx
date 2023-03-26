import { ApolloError } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, render, screen, waitFor } from "@testing-library/react";
import ChallengeCompletedFlashMessage from "app/components/challenge/ChallengeCompletedFlashMessage";
import { usePollSubmissionResult } from "app/components/evaluation/usePollSubmissionResult";
import { LottieProps } from "app/components/Lottie";
import { ChallengeBySlugDocument, CurrentUserDocument, ResultStatus } from "app/generated/graphql";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import Evaluation, { getServerSideProps } from "app/pages/challenge/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]";
import { GraphQLError } from "graphql";
import { GetServerSidePropsContext } from "next";
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
    hide: jest.fn(),
    portalRootRef: null,
  }),
}));

jest.mock("app/components/Breadcrumbs/Breadcrumbs", () => ({
  __esModule: true,
  default: () => <></>,
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

const renderEvaluationPage = (): void => {
  render(
    <MockedProvider mocks={mocks}>
      <Evaluation />
    </MockedProvider>,
  );
};

const resolveGraphQLQuery = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe("Evaluation", () => {
  describe("page", () => {
    it("renders the loading screen", async () => {
      renderEvaluationPage();

      expect(screen.getByText("loading ...")).toBeInTheDocument();
    });

    it("renders the head", async () => {
      renderEvaluationPage();
      await resolveGraphQLQuery();

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders the `EvaluationHeader`", async () => {
      renderEvaluationPage();
      await resolveGraphQLQuery();

      expect(screen.getByText("Evaluation - Mock Challenge Name - Level 2")).toBeInTheDocument();
    });

    it("renders the `CompleteEvaluationButton`", async () => {
      renderEvaluationPage();
      await resolveGraphQLQuery();

      expect(screen.getByRole("button", { name: "Finish Challenge" })).toBeInTheDocument();
    });

    it("sets failedLevelsInARow to 0 if status = Success", async () => {
      (usePollSubmissionResult as jest.Mock).mockReturnValue({ status: ResultStatus.Success, requirements: [], totalScore: 100 });

      renderEvaluationPage();
      await resolveGraphQLQuery();
      await waitFor(() => expect(mockShowFlashMessage).toHaveBeenCalledWith(<ChallengeCompletedFlashMessage />));
    });

    it("shows success flash massage if is success and last level", async () => {
      (useSessionState as jest.Mock).mockReturnValue([0, jest.fn()]);
      (usePollSubmissionResult as jest.Mock).mockReturnValue({ status: ResultStatus.Success, requirements: [], totalScore: 100 });

      renderEvaluationPage();
      await resolveGraphQLQuery();

      expect(useSessionState("")[1]).toHaveBeenCalledWith(0);
    });

    it("passes state update function to setFailedLevelsInARow if status = Fail", async () => {
      (useSessionState as jest.Mock).mockReturnValue([1, jest.fn()]);
      (usePollSubmissionResult as jest.Mock).mockReturnValue({ status: ResultStatus.Fail, requirements: [], totalScore: 100 });

      renderEvaluationPage();
      await resolveGraphQLQuery();

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
