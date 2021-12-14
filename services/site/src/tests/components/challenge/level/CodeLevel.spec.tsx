import "@testing-library/jest-dom/extend-expect";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { cleanup } from "@testing-library/react";
import ButtonLoading from "app/components/buttons/ButtonLoading";
import Editors from "app/components/challenge/Editors";
import CodeLevel from "app/components/challenge/level/CodeLevel";
import Preview from "app/components/challenge/Preview";
import Sidebar from "app/components/challenge/Sidebar";
import { CodeLevelDetailsFragment, LevelByChallengeSlugDocument } from "app/generated/graphql";
import { mount } from "enzyme";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

afterEach(cleanup);

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

beforeEach(() => {
  router.query = { challengeSlug: mockChallengeSlug, nthLevel: String(mockNthLevel) };
  router.back = jest.fn();
});

describe("Code Level", () => {
  it("renders `Sidebar` component", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={mockOnAutoSaveLoadingChange} />
      </MockedProvider>,
    );

    expect(wrapper.exists(Sidebar)).toBeTruthy();
  });

  it("renders `Editors` component", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={mockOnAutoSaveLoadingChange} />
      </MockedProvider>,
    );

    expect(wrapper.exists(Editors)).toBeTruthy();
  });

  it("renders `Preview` component", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={mockOnAutoSaveLoadingChange} />
      </MockedProvider>,
    );

    expect(wrapper.exists(Preview)).toBeTruthy();
  });

  it("renders submit button with loading animation", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={mockOnAutoSaveLoadingChange} />
      </MockedProvider>,
    );

    expect(wrapper.exists(ButtonLoading)).toBeTruthy();
  });

  it("disables the submit button if the submission is not yet available", () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CodeLevel challengeName={mockChallengeName} level={mockLevel} onAutoSaveLoadingChange={mockOnAutoSaveLoadingChange} />
      </MockedProvider>,
    );

    expect(wrapper.find(ButtonLoading).props()).toHaveProperty("disabled", true);
  });
});
