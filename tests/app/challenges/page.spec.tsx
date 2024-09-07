import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MockedResponse, MockLink } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { UserFactory } from "@tests/support/factories/models/user.factory";
import Challenges from "app/app/challenges/page";
import { ChallengeDifficulty, ChallengesDocument, ChallengeStatus } from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";

jest.mock("app/lib/apollo-client/rsc", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/lib/get-server-side-current-user", () => ({
  getServerSideCurrentUser: () => UserFactory.build(),
}));

function mockApolloClient(): void {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: ChallengesDocument,
      },
      result: {
        data: {
          challenges: [
            {
              __typename: "Challenge",
              id: "uuid-1",
              slug: "a-valid-html-document",
              name: "A valid HTML document",
              status: ChallengeStatus.Open,
              difficulty: ChallengeDifficulty.Easy,
              numberOfLevels: 2,
              numberOfFinishedLevels: 0,
              isMobileFriendly: false,
            },
            {
              __typename: "Challenge",
              id: "uuid-2",
              slug: "headings",
              name: "Headings",
              status: ChallengeStatus.InProgress,
              difficulty: ChallengeDifficulty.Easy,
              numberOfLevels: 2,
              numberOfFinishedLevels: 1,
              isMobileFriendly: false,
            },
          ],
        },
      },
    },
  ];

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });

  (getApolloClient as jest.Mock).mockReturnValue(client);
}

beforeEach(() => {
  jest.resetAllMocks();
  mockApolloClient();
});

describe("challenge page", () => {
  it("renders the Challenges", async () => {
    render(await Challenges());

    expect(screen.getByText("A valid HTML document")).toBeInTheDocument();
  });

  it("renders the continue where you left section", async () => {
    render(await Challenges());

    expect(screen.getByText("Continue where you left")).toBeInTheDocument();
  });
});
