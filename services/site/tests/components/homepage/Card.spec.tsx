import "@testing-library/jest-dom/extend-expect";

import { render, RenderResult, screen } from "@testing-library/react";
import Card, { CardProps } from "app/components/homepage/Card";
import Check from "app/components/icons/Check";
import { ChallengeDifficulty } from "app/generated/graphql";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

const headingText = "Semantic HTML";
const levelAmount = 12;

const card = (
  <Card
    key={1}
    className="mr-24"
    challengeSlug={"semantic-html"}
    heading={headingText}
    levels={levelAmount}
    finishedLevels={0}
    difficulty={ChallengeDifficulty.Easy}
    challengeNumber={1}
  />
);

const renderCard = (props?: Partial<CardProps>): RenderResult => {
  return render(
    React.cloneElement(card, {
      ...props,
    }),
  );
};

const shallowRenderCard = (props?: Partial<CardProps>): ShallowWrapper => {
  return shallow(
    React.cloneElement(card, {
      ...props,
    }),
  );
};

describe("Card", () => {
  it("renders the heading and description text", () => {
    renderCard();

    expect(screen.getByRole("link", { name: headingText })).toBeInTheDocument();
    expect(screen.getByText("12 Levels", { selector: "p" })).toBeInTheDocument();
  });

  it("renders the correct gradient for `Easy` challenges", () => {
    const view = shallowRenderCard({ difficulty: ChallengeDifficulty.Easy });

    expect(view.exists(".bg-gradient-easy")).toBeTruthy();
  });

  it("renders the correct gradient for `Medium` challenges", () => {
    const view = shallowRenderCard({ difficulty: ChallengeDifficulty.Medium });

    expect(view.exists(".bg-gradient-medium")).toBeTruthy();
  });

  it("renders the correct gradient for `Hard` challenges", () => {
    const view = shallowRenderCard({ difficulty: ChallengeDifficulty.Hard });

    expect(view.exists(".bg-gradient-hard")).toBeTruthy();
  });

  it("renders the progress indicator for started challenges", async () => {
    renderCard({
      finishedLevels: 7,
    });

    expect(screen.getByText(/7/i)).toBeInTheDocument();
  });
  it("renders a checkmark for finished challenges", () => {
    const view = shallowRenderCard({
      levels: levelAmount,
      finishedLevels: levelAmount,
    });

    expect(view.exists(Check)).toBeTruthy();
  });
});
