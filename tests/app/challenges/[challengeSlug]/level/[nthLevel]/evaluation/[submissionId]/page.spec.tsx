import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MockedResponse, MockLink } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import Evaluation from "app/app/challenges/[challengeSlug]/level/[nthLevel]/evaluation/[submissionId]/page";
import {
  ChallengeDetailsBySlugDocument,
  ChallengeDetailsBySlugQueryResult,
  ChallengeDifficulty,
  LevelByChallengeSlugDocument,
  LevelByChallengeSlugQueryResult,
  LevelStatus,
  ResultStatus,
} from "app/generated/graphql";
import { getApolloClient } from "app/lib/apollo-client/rsc";
import { getChallenge } from "app/lib/server-side-props/get-challenge";
import { CustomSubmissionResult, getSubmissionResult } from "app/lib/server-side-props/get-submission-result";
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

jest.mock("next/headers", () => ({
  headers: () => ({
    get: () => "text/html",
  }),
}));

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/components/evaluation/LoadingScreen", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock("app/components/evaluation/EvaluationResult", () => ({
  EvaluationResult: jest.fn(),
}));

jest.mock("app/lib/server-side-props/get-challenge", () => ({
  getChallenge: jest.fn(),
}));

jest.mock("app/lib/server-side-props/get-submission-result", () => ({
  getSubmissionResult: jest.fn(),
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

const defaultSubmissionResult: CustomSubmissionResult = {
  status: ResultStatus.Success,
  requirements: [],
  totalScore: 100,
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

describe("evaluation page", () => {
  it("calls notFound if challenge can't be found", async () => {
    (notFound as unknown as jest.Mock).mockImplementation(() => <></>);

    try {
      // expect error because notFound doesn't stop the execution
      jest.spyOn(console, "warn").mockImplementation();
      jest.spyOn(console, "error").mockImplementation();
      render(await Evaluation({ params: { challengeSlug: "non-existing", nthLevel: "69", submissionId: "id" } }));
    } catch {
      // noop
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("renders heading", async () => {
    (getChallenge as jest.Mock).mockImplementation(() => {
      return defaultChallenge;
    });

    (getSubmissionResult as jest.Mock).mockImplementation(() => {
      return defaultSubmissionResult;
    });

    render(await Evaluation({ params: { challengeSlug: "non-existing", nthLevel: "69", submissionId: "id" } }));

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
