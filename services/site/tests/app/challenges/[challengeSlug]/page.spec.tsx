import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MockedResponse, MockLink } from "@apollo/client/testing";
import { getAllByRole, getByRole, render, screen } from "@testing-library/react";
import Challenge, { generateMetadata } from "app/app/challenges/[challengeSlug]/page";
import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQueryResult, ChallengeDifficulty, LevelStatus } from "app/generated/graphql";
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

type Challenge = ChallengeDetailsBySlugQueryResult["data"]["challenge"];

const defaultChallenge: Challenge = {
  id: "uuid",
  name: "Challenge Title",
  difficulty: ChallengeDifficulty.Easy,
  introduction: "Introduction",
  levels: [{ id: "level-id", order: 1, status: LevelStatus.Open }],
};

function mockApolloClient(challenge: Challenge = defaultChallenge): void {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: ChallengeDetailsBySlugDocument,
        variables: { slug: "challenge-slug" },
      },
      result: {
        data: {
          challenge,
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

    expect(screen.getByText(/Level 01/)).toBeInTheDocument();
  });

  it("adds the challenge name in the page title", async () => {
    const metadata = await generateMetadata({ params: { challengeSlug: "challenge-slug" } });

    expect(metadata.title).toContain("Challenge Title");
  });

  it("renders a list of levels", async () => {
    mockApolloClient({
      id: "uuid",
      name: "Challenge Title",
      difficulty: ChallengeDifficulty.Easy,
      introduction: "Introduction",
      levels: [
        { id: "level-1", order: 1, status: LevelStatus.Open },
        { id: "level-2", order: 2, status: LevelStatus.Open },
      ],
    });

    render(await Challenge({ params: { challengeSlug: "challenge-slug" } }));

    const main = screen.getByRole("main");

    // due to nav in the footer the list of challenges is not the only
    // list on the page, to limit the test to the relevant area
    // the container is set to "main" element

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByRole(main, "list")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getAllByRole(main, "listitem")).toHaveLength(2);
  });

  it("adds 'start here' to the first level if the challenge was not started yet", async () => {
    render(await Challenge({ params: { challengeSlug: "challenge-slug" } }));

    expect(screen.getByText("Start here: Level 01")).toBeInTheDocument();
  });

  it("adds 'continure here' to the first unfinished level if the challenge", async () => {
    mockApolloClient({
      id: "uuid",
      name: "Challenge Title",
      difficulty: ChallengeDifficulty.Easy,
      introduction: "Introduction",
      levels: [
        { id: "level-1", order: 1, status: LevelStatus.Finished },
        { id: "level-2", order: 2, status: LevelStatus.Open },
      ],
    });

    render(await Challenge({ params: { challengeSlug: "challenge-slug" } }));

    expect(screen.getByText("Up next: Level 02")).toBeInTheDocument();
  });
});
