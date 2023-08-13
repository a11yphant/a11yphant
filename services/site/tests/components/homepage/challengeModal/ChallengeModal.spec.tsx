import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChallengeModal } from "app/components/homepage/challengeModal/ChallengeModal";
import { ChallengeDetailsBySlugDocument, ChallengeDetailsBySlugQuery, ChallengeDifficulty, LevelStatus } from "app/generated/graphql";
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

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>;

function renderModalWitoutWaitingForQuery(): void {
  render(<ChallengeModal challengeSlug={mockChallengeSlug} onClose={mockOnClose} open={true} />, { wrapper: Wrapper });
}

async function renderModal(): Promise<void> {
  renderModalWitoutWaitingForQuery();

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("ChallengeModal", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("renders loading indicator before receiving a graphql response", async () => {
    renderModalWitoutWaitingForQuery();

    // query from document instead of the render container since content is rendered to a portal
    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(document.querySelector("svg")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();

    // await query to avoid state updates after unmount
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it("renders a heading and introduction text", async () => {
    await renderModal();

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText(mockChallengeIntroduction)).toBeInTheDocument();
  });

  it("renders all levels as cards", async () => {
    await renderModal();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(mockLevels.length);
  });

  it("only one level card is hilighted as the first unfinished level", async () => {
    await renderModal();
    const links = screen.getAllByRole("link");

    const hilightedLinks = links.filter((link) => link.classList.contains("bg-primary"));
    expect(hilightedLinks).toHaveLength(1);
  });

  it("calls onClose when clickling cancel", async () => {
    await renderModal();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders a start coding button that routes to the first unfinished level", async () => {
    await renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Start Level" }));

    expect(router).toMatchObject({
      asPath: `/challenge/${mockChallengeSlug}/level/${firstUnfinishedLevel.order.toLocaleString("de-AT", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`,
    });
  });
});
