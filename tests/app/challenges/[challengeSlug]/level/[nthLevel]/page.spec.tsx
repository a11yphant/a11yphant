import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MockedResponse, MockLink } from "@apollo/client/testing";
import { act, render, screen } from "@testing-library/react";
import Level from "app/app/challenges/[challengeSlug]/level/[nthLevel]/page";
import CodeLevel from "app/components/challenge/level/CodeLevel";
import QuizLevel from "app/components/challenge/level/QuizLevel";
import {
  ChallengeDetailsBySlugDocument,
  ChallengeDetailsBySlugQueryResult,
  ChallengeDifficulty,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQueryResult,
  LevelStatus,
} from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import { notFound } from "next/navigation";
import React from "react";

jest.mock("app/lib/apollo-client/rsc", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/components/challenge/level/CodeLevel", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/components/challenge/level/QuizLevel", () => ({
  __esModule: true,
  default: jest.fn(),
}));

type ChallengeType = ChallengeDetailsBySlugQueryResult["data"]["challenge"];
type LevelType = LevelByChallengeSlugQueryResult["data"]["level"];

const defaultChallenge: ChallengeType = {
  id: "uuid",
  name: "Challenge Title",
  difficulty: ChallengeDifficulty.Easy,
  introduction: "Introduction",
  levels: [{ id: "level-id", order: 1, status: LevelStatus.Open }],
};

const defaultCodeLevel: LevelType = {
  __typename: "CodeLevel",
  id: "0c7968b5-c2a8-47d0-ad10-8cd79a2a6493",
  instructions:
    "<p>Each website requires a bit of boilerplate code that tells the browser key information about the page. The first required statement is the doctype. The doctype tells the browser which version of HTML is used for this page. A doctype should look like this: <code>&lt;!DOCTYPE {HTML_VERSION}&gt;</code>. For example, if <code>html</code> is specified as the version, browsers will use HTML5 (the latest version) for rendering. The doctype needs to be at the very beginning of the document.</p>",
  tasks: [
    {
      id: "239908ab-0206-468c-8113-af420f26a3cf",
      text: "<p>Add the doctype declaration for HTML5 to the <code>&lt;!DOCTYPE&gt;</code> in the editor.</p>",
      hints: [
        {
          id: "8b1f4cba-504e-4b15-a288-d49d8a8911cb",
          text: '<p>You must create an <code>&lt;a&gt;</code> element, set the <code>href</code> attribute to <a href="https://a11yphant.com">https://a11yphant.com</a> and add descriptive text about the link direction inside the link element. For example: \n\n<code>&lt;a href=&quot;https://a11yphant.com/&quot;&gt;\n    a11yphant\n&lt;/a&gt;</code></p>\n',
        },
      ],
    },
  ],
  code: {
    html: "<!-- add the doctype here -->\n<html>\n\n  <head>\n    <title>Cats or Dogs?</title>\n  </head>\n  \n  <body>\n    <p>Cats are better than dogs!</p>\n  </body>\n</html>",
    css: null,
    js: null,
  },
  hasHtmlEditor: true,
  hasCssEditor: false,
  hasJsEditor: false,
  lastSubmission: {
    id: "4460635f-112f-40b3-b611-e7d02e324219",
    html: "<!-- add the doctype here -->\n<html>\n\n  <head>\n    <title>Cats or Dogs?</title>\n  </head>\n  \n  <body>\n    <p>Cats are better than dogs!</p>\n  </body>\n</html>",
    css: null,
    js: null,
    result: null,
  },
};

const defaultQuizLevel: LevelType = {
  __typename: "QuizLevel",
  id: "71aab54b-0c51-4c4e-b134-3ed2f6b41d83",
  question: "Which statement about <code>&lt;!DOCTYPE html&gt;</code> is true?",
  answerOptions: [
    {
      __typename: "AnswerOption",
      id: "c6427184-0cd9-45d9-9aeb-fdf326aa70e5",
      text: "It tells the browser to use the latest html version to render the page.",
    },
    {
      __typename: "AnswerOption",
      id: "8c5748a7-eaf8-4168-ac63-33d35f3a92ba",
      text: "It specifies that no HTML code will be used in the following document.",
    },
    {
      __typename: "AnswerOption",
      id: "18472aed-1e05-45e2-a2e4-b2126716e7a9",
      text: "<code>&lt;!DOCTYPE html&gt;</code> does not exist in the HTML specification.",
    },
    { __typename: "AnswerOption", id: "64f297c7-f7ed-4214-90b5-13babcae6f81", text: "It is not required in a valid HTML document." },
  ],
};

function mockApolloClient({ challenge = defaultChallenge, level = defaultCodeLevel }: { challenge?: ChallengeType; level?: LevelType }): void {
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
    {
      request: {
        query: ChallengeDetailsBySlugDocument,
        variables: { slug: "non-existing" },
      },
      result: {
        data: {},
      },
    },
    {
      request: {
        query: LevelByChallengeSlugDocument,
        variables: { challengeSlug: "challenge-slug", nth: 1 },
      },
      result: {
        data: {
          level,
        },
      },
    },
    {
      request: {
        query: LevelByChallengeSlugDocument,
        variables: { challengeSlug: "challenge-slug", nth: 69 },
      },
      result: {
        data: {},
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
  mockApolloClient({});
});

describe("level page", () => {
  it("calls notFound if challenge can't be found", async () => {
    (notFound as unknown as jest.Mock).mockImplementation(() => <></>);

    try {
      // expect error because notFound doesn't stop the execution
      jest.spyOn(console, "warn").mockImplementation();
      jest.spyOn(console, "error").mockImplementation();
      render(await Level({ params: { challengeSlug: "non-existing", nthLevel: "69" } }));
    } catch {
      // noop
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound if level can't be found", async () => {
    (notFound as unknown as jest.Mock).mockImplementation(() => <></>);

    try {
      // expect error because notFound doesn't stop the execution
      jest.spyOn(console, "error").mockImplementation();
      render(await Level({ params: { challengeSlug: "challenge-slug", nthLevel: "69" } }));
    } catch {
      // noop
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("renders h1 with challenge name and level", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(await Level({ params: { challengeSlug: "challenge-slug", nthLevel: "1" } }));
    });

    expect(screen.getByRole("heading", { level: 1, name: `${defaultChallenge.name} - Level 1` })).toBeInTheDocument();
  });

  it("renders CodeLevel if is CodeLevel", async () => {
    mockApolloClient({ level: defaultCodeLevel });
    (CodeLevel as unknown as jest.Mock).mockImplementation(() => <></>);

    render(await Level({ params: { challengeSlug: "challenge-slug", nthLevel: "1" } }));

    expect(CodeLevel).toHaveBeenCalled();
  });

  it("renders QuizLevel if is QuizLevel", async () => {
    mockApolloClient({ level: defaultQuizLevel });
    (QuizLevel as unknown as jest.Mock).mockImplementation(() => <></>);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(await Level({ params: { challengeSlug: "challenge-slug", nthLevel: "1" } }));
    });

    expect(QuizLevel).toHaveBeenCalled();
  });
});
