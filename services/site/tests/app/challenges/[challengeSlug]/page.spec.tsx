import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MockedResponse, MockLink } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import Challenge, { generateMetadata } from "app/app/challenge/[challengeSlug]/page";
import { ChallengeDetailsBySlugDocument, ChallengeDifficulty, LevelStatus } from "app/generated/graphql";
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

function mockApolloClient(): void {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: ChallengeDetailsBySlugDocument,
        variables: { slug: "challenge-slug" },
      },
      result: {
        data: {
          challenge: {
            id: "uuid",
            name: "Challenge Title",
            difficulty: ChallengeDifficulty.Easy,
            introduction: "Introduction",
            levels: [{ id: "level-id", order: 1, status: LevelStatus.Open }],
          },
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
  it("renders the challenge title", async () => {
    render(await Challenge({ params: { challengeSlug: "challenge-slug" } }));

    expect(screen.getByText("Challenge Title")).toBeInTheDocument();
  });

  it("renders the levels", async () => {
    render(await Challenge({ params: { challengeSlug: "challenge-slug" } }));

    expect(screen.getByText("Level 01")).toBeInTheDocument();
  });

  it("adds the challenge name in the page title", async () => {
    const metadata = await generateMetadata({ params: { challengeSlug: "challenge-slug" } });

    expect(metadata.title).toContain("Challenge Title");
  });
});
