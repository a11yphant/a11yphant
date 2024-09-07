import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { render, RenderResult, screen } from "@testing-library/react";
import CodeLevel, { CodeLevelProps } from "app/components/challenge/level/CodeLevel";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { CodeLevelDetailsFragment, LevelByChallengeSlugDocument } from "app/generated/graphql";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import { useParams } from "next/navigation";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

jest.mock("app/hooks/sessionState/useSessionState", () => ({
  useSessionState: jest.fn(),
}));

jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: jest.fn(),
}));

const mockChallengeSlug = "mock-slug";
const mockNthLevel = 2;
const mockChallengeName = "HTML Basics";
const mockLevel: CodeLevelDetailsFragment = {
  id: "1",
  instructions: "This is a instruction.",
  hasHtmlEditor: true,
  tasks: [
    {
      id: "11",
      text: "This is the first task.",
      hints: [
        {
          id: "111",
          text: "This is a hint.",
        },
      ],
    },
  ],
  code: {
    html: "html",
    css: "css",
    js: "js",
  },
};

const mocks: MockedResponse[] = [
  {
    request: {
      query: LevelByChallengeSlugDocument,
      variables: {
        challengeSlug: mockChallengeSlug,
        nth: 1,
      },
    },
    result: {
      data: {
        level: mockLevel,
      },
    },
  },
];

interface MountCodeLevelParams {
  mockedResponses?: MockedResponse[];
  props?: Partial<CodeLevelProps>;
}
const mountCodeLevel = (options?: MountCodeLevelParams): RenderResult => {
  const mockedResponses = options?.mockedResponses ?? mocks;

  return render(
    <MockedProvider mocks={mockedResponses}>
      <CodeLevel challengeName={mockChallengeName} level={mockLevel} {...options?.props} />
    </MockedProvider>,
  );
};

describe("Code Level", () => {
  beforeEach(() => {
    router.query = { challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) };
    (useParams as jest.Mock).mockImplementation(() => router.query);
    router.back = jest.fn();
    jest.restoreAllMocks();
    (useSessionState as jest.Mock).mockImplementation(() => [1, jest.fn()]);
    (useFlashMessageApi as jest.Mock).mockImplementation(() => ({
      show: jest.fn(),
      hide: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the sidebar with instructions", () => {
    mountCodeLevel();

    expect(screen.getByText(mockLevel.instructions)).toBeInTheDocument();
  });

  it("renders `Editors` component", () => {
    mountCodeLevel();

    expect(screen.getByText("The editor is loading...")).toBeInTheDocument();
  });

  it("renders `Preview` component", () => {
    mountCodeLevel();

    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  it("disables the submit button if the submission is not yet available", () => {
    mountCodeLevel();

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("renders FlashMessage if the user failed two times in a row", () => {
    jest.useFakeTimers();

    (useSessionState as jest.Mock).mockReturnValue([2, jest.fn()]);
    (useFlashMessageApi as jest.Mock).mockReturnValue({
      show: jest.fn(),
      hide: jest.fn(),
    });

    mountCodeLevel();

    jest.advanceTimersByTime(1000);

    expect(useFlashMessageApi().show).toHaveBeenCalledTimes(1);
  });

  it("hides FlashMessage on unmount", () => {
    (useFlashMessageApi as jest.Mock).mockReturnValue({
      show: jest.fn(),
      hide: jest.fn(),
    });

    const { unmount } = mountCodeLevel();

    unmount();

    expect(useFlashMessageApi().hide).toHaveBeenCalledTimes(1);
  });
});
