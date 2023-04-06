import { render, screen } from "@testing-library/react";
import HintList from "app/components/challenge/sidebar/HintList";
import { Task } from "app/generated/graphql";
import React from "react";

const mockTasks: Task[] = [
  {
    id: "923438fa-8c5f-4b97-897e-bf906f467c47",
    text: "Mock Task 1",
    hints: [
      {
        id: "e6048f13-1801-484c-a5a8-83db763896d4",
        text: "Mock Hint 1.1",
      },
      {
        id: "54a0b53c-cfad-4b88-9f49-50edf065d6f9",
        text: "Mock Hint 1.2",
      },
    ],
  },
  {
    id: "33d12b2b-300d-4bc7-9ace-e2a597df3d82",
    text: "Mock Task 2",
    hints: [
      {
        id: "6561eb57-39d2-48d2-89b0-cb91dabef391",
        text: "Mock Hint 2.1",
      },
      {
        id: "6b52a40b-6d05-4935-a76c-4e58114a8c80",
        text: "Mock Hint 2.2",
      },
    ],
  },
];

describe("HintList", () => {
  it("renders text and a HintBox if there is only one hint", () => {
    const task = mockTasks[0];
    render(<HintList tasks={[task]} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByText("Stuck? Click to reveal a hint")).toBeInTheDocument();
  });

  it("renders text as HTML if there is only one hint", () => {
    const task = mockTasks[0];
    render(<HintList tasks={[task]} />);

    expect(screen.getByText(task.text)).toBeInTheDocument();
  });

  it("renders a list of text and HintBoxes if there are multiple hints", () => {
    render(<HintList tasks={mockTasks} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(mockTasks.length);
    expect(screen.getAllByText("Stuck? Click to reveal a hint")).toHaveLength(mockTasks.length);
  });
});
