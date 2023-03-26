import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HintBox from "app/components/challenge/sidebar/HintBox";
import React from "react";

const hints = [
  {
    id: "e6048f13-1801-484c-a5a8-83db763896d4",
    text: "Mock Hint 1",
  },
  {
    id: "54a0b53c-cfad-4b88-9f49-50edf065d6f9",
    text: "Mock Hint 2",
  },
];

describe("HintBox", () => {
  it("renders the box closed by default", () => {
    render(<HintBox hints={hints} />);

    expect(screen.getByRole("heading", { level: 4, name: "Stuck? Click to reveal a hint" })).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders open HintBox after click", async () => {
    render(<HintBox hints={hints} />);

    await userEvent.click(screen.getByRole("button"));

    // show one hint in a list after click
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").find((item) => item.textContent === hints[0].text)).toBeInTheDocument();

    // check if the heading contains the hint text
    expect(screen.getByRole("heading", { level: 4, name: "Hint" })).toBeInTheDocument();
    // show "Show me another hint" button since there are two mocked hints
    expect(screen.getByRole("button", { name: "Show me another hint." })).toBeInTheDocument();
  });

  it("renders another hint in open HintBox after click", async () => {
    render(<HintBox hints={hints} />);

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button", { name: "Show me another hint." }));

    // show 2 li tags after clicking "Show me another hint"
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("listitem").find((item) => item.textContent === hints[0].text)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").find((item) => item.textContent === hints[1].text)).toBeInTheDocument();

    // Since there are two mocked hints, the "Show me another hint" button disappears once both hints are shown
    expect(screen.queryByRole("button", { name: "Show me another hint." })).not.toBeInTheDocument();
  });
});
