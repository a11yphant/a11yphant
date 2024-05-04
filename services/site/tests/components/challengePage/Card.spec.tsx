import { render, RenderResult, screen } from "@testing-library/react";
import Card, { CardProps } from "app/components/challengePage/Card";
import { ChallengeDifficulty, ChallengeStatus } from "app/generated/graphql";
import React from "react";

const levelAmount = 12;

const card = (
  <Card
    className="mr-24"
    challengeSlug={"semantic-html"}
    heading={"Semantic HTML"}
    levels={levelAmount}
    finishedLevels={0}
    difficulty={ChallengeDifficulty.Easy}
    challengeNumber={1}
    challengeStatus={ChallengeStatus.InProgress}
  />
);

const renderCard = (props?: Partial<CardProps>): RenderResult => {
  return render(
    React.cloneElement(card, {
      ...props,
    }),
  );
};

describe("Card", () => {
  it("renders the heading and description text", () => {
    renderCard();

    expect(screen.getByRole("link", { name: "Challenge 1: Semantic HTML" })).toBeInTheDocument();
    expect(screen.getByText("12 Levels", { selector: "p" })).toBeInTheDocument();
  });

  it("renders the mobile friendly indicator", () => {
    renderCard({ isMobileFriendly: true });

    expect(screen.getByText("Mobile friendly", { selector: "span" })).toBeInTheDocument();
  });

  it("renders the correct gradient for `Easy` challenges", () => {
    const { container } = renderCard({ difficulty: ChallengeDifficulty.Easy });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector(".bg-gradient-easy")).toBeTruthy();
  });

  it("renders the correct gradient for `Medium` challenges", () => {
    const { container } = renderCard({ difficulty: ChallengeDifficulty.Medium });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector(".bg-gradient-medium")).toBeTruthy();
  });

  it("renders the correct gradient for `Hard` challenges", () => {
    const { container } = renderCard({ difficulty: ChallengeDifficulty.Hard });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector(".bg-gradient-hard")).toBeTruthy();
  });

  it("renders the progress indicator for started challenges", async () => {
    renderCard({
      finishedLevels: 7,
    });

    expect(screen.getByText(/7/i)).toBeInTheDocument();
  });

  it("renders a checkmark for finished challenges", () => {
    const { container } = renderCard({
      levels: levelAmount,
      finishedLevels: levelAmount,
    });

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
