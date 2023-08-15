import { render, screen } from "@testing-library/react";
import CustomError from "app/pages/_error";
import { NextPageContext } from "next";
import React from "react";

jest.mock("app/components/Navigation", () => ({
  __esModule: true,
  default: () => <></>,
}));

describe("Error Page", () => {
  it("renders a heading with the status code", () => {
    render(<CustomError statusCode={500} />);

    expect(screen.getByRole("heading", { level: 1, name: "Error 500" })).toBeInTheDocument();
  });

  it("renders a description text", () => {
    render(<CustomError statusCode={500} />);

    expect(screen.getByText("ooops, something went wrong")).toBeInTheDocument();
  });

  it("disables capturing errors on the frontend if getInitialProps has already been run", async () => {
    const error = new Error("test");
    const { hasGetInitialPropsRun } = await CustomError.getInitialProps({ err: error } as NextPageContext);

    expect(hasGetInitialPropsRun).toBe(true);
  });
});
