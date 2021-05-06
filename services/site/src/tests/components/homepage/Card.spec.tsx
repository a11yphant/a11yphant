import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Card from "app/components/homepage/Card";
import { ChallengeDifficulty } from "app/generated/graphql";

afterEach(cleanup);

const headingText = "Semantic HTML";
const levelAmount = 12;

describe("Card", () => {
  it("renders correctly", () => {
    render(
      <Card
        key={1}
        className="mr-24"
        challengeSlug={"semantic-html"}
        heading={headingText}
        levels={levelAmount}
        difficulty={ChallengeDifficulty.Easy}
        challengeNumber={1}
      />,
    );

    expect(screen.getByText(headingText, { selector: "a" })).toBeTruthy();
    expect(screen.getByText("12 Levels", { selector: "p" })).toBeTruthy();
    // image is temporarily replaced with an background image
    // expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
  });
});
