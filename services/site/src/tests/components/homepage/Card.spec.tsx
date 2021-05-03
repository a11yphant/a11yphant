import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import { DifficultyLevel } from "app/components/homepage/Card";
import Card from "app/components/homepage/Card";

afterEach(cleanup);

const headingText = "Easy";
const levelAmount = 12;

describe("Card", () => {
  it("renders correctly", () => {
    const { container } = render(<Card className="mr-24" heading={headingText} levels={levelAmount} difficulty={DifficultyLevel.easy} />);

    expect(screen.getByText(headingText, { selector: "h4" })).toBeTruthy();
    expect(screen.getByText("12 Levels", { selector: "p" })).toBeTruthy();
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
  });
});
