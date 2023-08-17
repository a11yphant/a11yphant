import { render, screen } from "@testing-library/react";
import Legend from "app/components/homepage/Legend";
import React from "react";

describe("Legend", () => {
  it("renders a list with all challenge difficulties", () => {
    render(<Legend />);

    expect(screen.getByRole("list", { hidden: true })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem", { hidden: true })).toHaveLength(3);

    expect(screen.getByText("Easy", { selector: "li:nth-of-type(1)" })).toBeInTheDocument();
    expect(screen.getByText("Medium", { selector: "li:nth-of-type(2)" })).toBeInTheDocument();
    expect(screen.getByText("Hard", { selector: "li:nth-of-type(3)" })).toBeInTheDocument();
  });
});
