import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act } from "@testing-library/react";
import ScrollOverlayWrapper from "app/components/common/ScrollOverlayWrapper";
import { ChallengeModal } from "app/components/homepage/challengeModal/ChallengeModal";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import { ModalTitle } from "app/components/modal/ModalTitle";
import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQuery, ChallengeDifficulty, LevelStatus } from "app/generated/graphql";
import { mount, ReactWrapper } from "enzyme";
import router from "next/router";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("react-resize-detector", () => ({
  useResizeDetector: () => {
    return;
  },
}));

const mockChallengeSlug = "mocked-challenge-slug";
const mockChallengeName = "A mocked Challenge";
const mockChallengeIntroduction = "This is the introduction to a mocked challenge.";
const mockOnClose = jest.fn();

const mockLevels = [
  { id: "0c7968b5-c2a8-47d0-ad10-8cd79a2a6493", order: 1, status: LevelStatus.Finished },
  { id: "71aab54b-0c51-4c4e-b134-3ed2f6b41d83", order: 2, status: LevelStatus.Finished },
  { id: "d548e9f3-92e9-4e42-b921-dc0167010d4a", order: 3, status: LevelStatus.InProgress },
  { id: "012d0f47-d66e-43d5-802d-f8683e43804f", order: 4, status: LevelStatus.Open },
  { id: "fdd35cbf-ba59-4b2f-98b5-9395f629e778", order: 5, status: LevelStatus.Open },
  { id: "87468d31-afdb-4417-be04-1113be1eafb1", order: 6, status: LevelStatus.Open },
  { id: "850f4919-3c86-430c-89d2-b0363022031a", order: 7, status: LevelStatus.Open },
  { id: "8e763092-092c-4cfd-8164-193797be550a", order: 8, status: LevelStatus.Open },
];
const firstUnfinishedLevel = mockLevels.find((level) => level.status === LevelStatus.Open || level.status === LevelStatus.InProgress);

const mocks: Array<MockedResponse<ChallengeDetailsBySlugQuery>> = [
  {
    request: {
      query: ChallengeDetailsBySlugDocument,
      variables: {
        slug: mockChallengeSlug,
      },
    },
    result: {
      data: {
        challenge: {
          id: "8b350581-bf0f-4d36-b8b6-09c470d613d0",
          difficulty: ChallengeDifficulty.Easy,
          name: mockChallengeName,
          introduction: mockChallengeIntroduction,
          levels: mockLevels,
        },
      },
    },
  },
];

describe("ChallengeModal", () => {
  let wrapper: ReactWrapper;
  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();

    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ChallengeModal challengeSlug={mockChallengeSlug} onClose={mockOnClose} open={true} />
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });
  });

  it("renders loading indicator before receiving a graphql response", () => {
    // override wrapper from beforeEach because
    // we don't want the query to resolve
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ChallengeModal challengeSlug={mockChallengeSlug} onClose={mockOnClose} open={true} />
      </MockedProvider>,
    );

    expect(wrapper.exists(LoadingIndicator)).toBeTruthy();
    expect(wrapper.exists(ModalTitle)).toBeFalsy();
  });

  it("renders a heading and introduction text", async () => {
    expect(wrapper.find(ModalTitle).text()).toBe(mockChallengeName);
    expect(wrapper.find("p").text()).toBe(mockChallengeIntroduction);
  });

  it("renders the `ScrollOverlayWrapper`", async () => {
    expect(wrapper.exists(ScrollOverlayWrapper)).toBeTruthy();
  });

  it("renders all levels as cards", async () => {
    expect(wrapper.find(ChallengeModalLevelCard).length).toBe(mockLevels.length);
  });

  it("only one level card has the 'isFirstUnfinishedLevel' attribute", () => {
    expect(wrapper.find(ChallengeModalLevelCard).findWhere((n) => n.props().isFirstUnfinishedLevel === true).length).toBe(1);
    expect(
      wrapper
        .find(ChallengeModalLevelCard)
        .findWhere((n) => n.props().isFirstUnfinishedLevel === true)
        .props().levelNumber,
    ).toBe(firstUnfinishedLevel.order);
  });

  it("renders a cancel button that calls onClose", () => {
    wrapper
      .find("button")
      .findWhere((n) => n.type() === "button" && n.text() === "Cancel")
      .simulate("click");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders a start coding button that routes to the first unfinished level", () => {
    wrapper
      .find("button")
      .findWhere((n) => n.type() === "button" && n.text() === "Start Coding")
      .simulate("click");

    expect(router).toMatchObject({
      asPath: `/challenge/${mockChallengeSlug}/level/${firstUnfinishedLevel.order.toLocaleString("de-AT", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`,
    });
  });
});
