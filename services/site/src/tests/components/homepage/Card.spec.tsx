import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Card from "app/components/homepage/Card";

afterEach(cleanup);

const headingText = "Easy";
const levelText = "12 Levels";

describe("Card", () => {
  it("renders correctly", () => {
    render(
      <Card heading={headingText} easy>
        <div className="flex justify-between">
          <p className="m-0">{levelText}</p>
          <div className="flex">
            <div className="w-3 h-5 border-2 rounded border-primary bg-primary ml-4" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
          </div>
        </div>
      </Card>,
    );

    expect(screen.getByText(headingText, { selector: "h4" })).toBeTruthy();
    expect(screen.getByText(levelText, { selector: "p" })).toBeTruthy();

    // TODO: check if image is present (easy is set)
    // expect(container.querySelectorAll("Image")).toHaveProperty("width", 1);
  });
});
