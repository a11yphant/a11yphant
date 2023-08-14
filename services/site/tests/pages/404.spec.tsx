import { render, screen } from "@testing-library/react";
import Custom404 from "app/pages/404";
import React from "react";

const mockHeading = "Error 404";
const mockText = "seems like you got lost in space";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("404 Page", () => {
  it("renders a heading", () => {
    render(<Custom404 />);

    expect(screen.getByText(mockHeading)).toBeInTheDocument();
  });

  it("renders a description text", () => {
    render(<Custom404 />);

    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it("renders a link", () => {
    render(<Custom404 />);

    expect(screen.getByRole("link", { name: /Go to homepage/ })).toBeInTheDocument();
  });

  it("renders the illustration SVG", () => {
    render(<Custom404 />);

    expect(screen.getByTestId("IllustrationLostSpace")).toBeInTheDocument();
  });
});
