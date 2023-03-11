import "@testing-library/jest-dom/extend-expect";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import LoadingButton from "app/components/buttons/LoadingButton";
import Editors from "app/components/challenge/Editors";
import CodeLevel, { CodeLevelProps } from "app/components/challenge/level/CodeLevel";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import { useFlashMessageApi } from "app/components/common/flashMessage/FlashMessageContext";
import { CodeLevelDetailsFragment, LevelByChallengeSlugDocument } from "app/generated/graphql";
import { useSessionState } from "app/hooks/sessionState/useSessionState";
import { mount, ReactWrapper } from "enzyme";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

jest.mock("app/hooks/sessionState/useSessionState", () => ({
  useSessionState: jest.fn(),
}));

jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
  })),
}));

const mockChallengeSlug = "mock-slug";
const mockNthLevel = 2;
const mockChallengeName = "HTML Basics";
const mockOnAutoSaveLoadingChange = jest.fn();
const mockLevel: CodeLevelDetailsFragment = {
  id: "1",
  instructions: "This is a instruction.",
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
const mountCodeLevel = (options?: MountCodeLevelParams): ReactWrapper => {
  const mockedResponses = options?.mockedResponses ?? mocks;

  return mount(
    <MockedProvider mocks={mockedResponses}>
      <CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={mockOnAutoSaveLoadingChange} {...options?.props} />
    </MockedProvider>,
  );
};

describe("Code Level", () => {
  beforeEach(() => {
    router.query = { challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) };
    router.back = jest.fn();
    jest.restoreAllMocks();
    (useSessionState as jest.Mock).mockImplementation(() => [1, jest.fn()]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders `Sidebar` component", () => {
    const view = mountCodeLevel();

    expect(view.exists(Sidebar)).toBeTruthy();
  });

  it("renders `Editors` component", () => {
    const view = mountCodeLevel();

    expect(view.exists(Editors)).toBeTruthy();
  });

  it("renders `Preview` component", () => {
    const view = mountCodeLevel();

    expect(view.exists(Preview)).toBeTruthy();
  });

  it("renders submit button with loading animation", () => {
    const view = mountCodeLevel();

    expect(view.exists(LoadingButton)).toBeTruthy();
  });

  it("disables the submit button if the submission is not yet available", () => {
    const view = mountCodeLevel();

    expect(view.find(LoadingButton).props()).toHaveProperty("disabled", true);
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

    const view = mountCodeLevel();

    view.unmount();
    expect(useFlashMessageApi().hide).toHaveBeenCalledTimes(1);
  });
});
