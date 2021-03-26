import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import ChallengeList from "app/components/homepage/ChallengeList";

afterEach(cleanup);

const headingText = "Easy";

describe("ChallengeList", () => {
  it("renders correctly", () => {
    render(
      <ChallengeList
        heading={
          <>
            Easy
            <div className="w-3 h-5 border-2 rounded border-primary bg-primary ml-4" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
            <div className="w-3 h-5 border-2 rounded border-primary bg-white ml-1" />
          </>
        }
        completedLevel={0}
        openLevel={1}
      />,
    );

    expect(screen.getByText(headingText, { selector: "h3" })).toBeTruthy();
    expect(screen.getByText("(0/1)", { selector: "p" })).toBeTruthy();
  });
});
