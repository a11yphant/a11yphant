import { render, screen } from "@testing-library/react";
import Sidebar from "app/components/challenge/Sidebar";
import { CodeLevel } from "app/generated/graphql";
import React from "react";

const mockChallengeName = "Mock Challenge";

const mockLevel: Pick<CodeLevel, "instructions" | "tasks"> = {
  instructions: "<h4>Mock Instructions</h4>",
  tasks: [
    {
      id: "158d0b51-dd31-422a-9c52-f6f9e2a74c24",
      text: "Mock Task",
      hints: [
        {
          id: "e3b455de-6165-44d9-92cd-06bd5da0929b",
          text: "Mock Hint Text",
        },
      ],
    },
  ],
};

describe("Sidebar", () => {
  it("renders the wrapper element with classes", () => {
    const mockClassName = "mock-class";
    const { container } = render(<Sidebar className={mockClassName} challengeName={mockChallengeName} level={mockLevel} />);

    // eslint-disable-next-line testing-library/prefer-screen-queries, testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders the challenge name as heading", () => {
    render(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(screen.getByRole("heading", { level: 2, name: mockChallengeName })).toBeInTheDocument();
  });

  it("renders a heading for instructions", () => {
    render(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(screen.getByRole("heading", { level: 3, name: "Instructions" })).toBeInTheDocument();
  });

  it("renders the instructions as HTML", () => {
    const { container } = render(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(container.innerHTML).toContain(mockLevel.instructions);
  });

  it("renders the hints", () => {
    render(<Sidebar challengeName={mockChallengeName} level={mockLevel} />);

    expect(screen.getByRole("button", { name: "Stuck? Click to reveal a hint" })).toBeInTheDocument();
  });
});
