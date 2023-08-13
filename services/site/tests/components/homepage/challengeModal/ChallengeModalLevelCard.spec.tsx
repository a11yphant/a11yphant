import { render, screen } from "@testing-library/react";
import { ChallengeModalLevelCard } from "app/components/homepage/challengeModal/ChallengeModalLevelCard";
import { LevelStatus } from "app/generated/graphql";
import React from "react";

const mockChallengeSlug = "mocked-challenge-slug";
const mockLevelNumber = "03";

describe("ChallengeModalLevelCard", () => {
  it("renders the heading", () => {
    render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
        type={"CodingLevel"}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: `Level ${mockLevelNumber}` })).toBeInTheDocument();
  });

  it("renders a checkmark icon if the challenge is finished", () => {
    const { container } = render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Finished}
        isFirstUnfinishedLevel={false}
        type={"CodingLevel"}
      />,
    );

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders no checkmark icon if the challenge is not finished", () => {
    const { container } = render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
        type={"CodingLevel"}
      />,
    );

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders no checkmark icon if the challenge is still in progress", () => {
    const { container } = render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.InProgress}
        isFirstUnfinishedLevel={false}
        type={"CodingLevel"}
      />,
    );

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders the challenge card with the background color `primary` if it is the first unfinished level", () => {
    render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={true}
        type={"CodingLevel"}
      />,
    );

    expect(screen.getByRole("link")).toHaveClass("bg-primary");
  });

  it("renders the challenge card without the background color `primary` if it is NOT the first unfinished level", () => {
    render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
        type={"CodingLevel"}
      />,
    );

    expect(screen.getByRole("link")).not.toHaveClass("bg-primary");
  });

  it("links to correct url", () => {
    render(
      <ChallengeModalLevelCard
        challengeSlug={mockChallengeSlug}
        levelNumber={Number(mockLevelNumber)}
        status={LevelStatus.Open}
        isFirstUnfinishedLevel={false}
        type={"CodingLevel"}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", `/challenge/${mockChallengeSlug}/level/${mockLevelNumber}`);
  });
});
