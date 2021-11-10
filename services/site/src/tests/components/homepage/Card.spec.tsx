import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Card from "app/components/homepage/Card";
import { ChallengeDifficulty } from "app/generated/graphql";

afterEach(cleanup);

const headingText = "Semantic HTML";
const levelAmount = 12;
const finishedLevels = 0;

describe("Card", () => {
  it("renders correctly", () => {
    render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        finishedLevels={finishedLevels}
        difficulty={ChallengeDifficulty.Easy}
        challengeNumber={1}
      />,
    );

    expect(screen.getByText(headingText, { selector: "a" })).toBeTruthy();
    expect(screen.getByText("12 Levels", { selector: "p" })).toBeTruthy();
  });

  it("renders the correct gradient for easy challenges", () => {
    const { container } = render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        finishedLevels={finishedLevels}
        difficulty={ChallengeDifficulty.Easy}
        challengeNumber={1}
      />,
    );

    expect(container.querySelector(".bg-gradient-easy")).toBeTruthy();
  });

  it("renders the correct gradient for medium challenges", () => {
    const { container } = render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        finishedLevels={finishedLevels}
        difficulty={ChallengeDifficulty.Medium}
        challengeNumber={1}
      />,
    );

    expect(container.querySelector(".bg-gradient-medium")).toBeTruthy();
  });

  it("renders the correct gradient for hard challenges", () => {
    const { container } = render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        finishedLevels={finishedLevels}
        difficulty={ChallengeDifficulty.Hard}
        challengeNumber={1}
      />,
    );

    expect(container.querySelector(".bg-gradient-hard")).toBeTruthy();
  });

  it("renders the progress for started challenges", async () => {
    const { findByText } = render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        finishedLevels={7}
        difficulty={ChallengeDifficulty.Hard}
        challengeNumber={1}
      />,
    );

    expect(await findByText(/7/i)).toBeTruthy();
  });
  it("renders a checkmark for finished challenges", () => {
    const { container } = render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        finishedLevels={levelAmount}
        difficulty={ChallengeDifficulty.Hard}
        challengeNumber={1}
      />,
    );

    expect(container.querySelector("svg")).toBeTruthy();
  });
});
