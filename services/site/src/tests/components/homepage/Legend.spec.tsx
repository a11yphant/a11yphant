import "@testing-library/jest-dom/extend-expect";

import { cleanup, render, screen } from "@testing-library/react";
import Legend from "app/components/homepage/Legend";
import React from "react";

afterEach(cleanup);

describe("Legend", () => {
  it("renders correctly", () => {
    const { container } = render(<Legend />);

    expect(container.querySelectorAll("ul")).toHaveProperty("length", 1);
    expect(container.querySelectorAll("li")).toHaveProperty("length", 3);
    expect(container.querySelectorAll("div")).toHaveProperty("length", 10);
    expect(screen.getByText("Easy", { selector: "li:nth-of-type(1)" })).toBeTruthy();
    expect(screen.getByText("Medium", { selector: "li:nth-of-type(2)" })).toBeTruthy();
    expect(screen.getByText("Hard", { selector: "li:nth-of-type(3)" })).toBeTruthy();
  });
});
