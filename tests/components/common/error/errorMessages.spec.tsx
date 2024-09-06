import { render, screen } from "@testing-library/react";
import { NetworkError, UnknownError } from "app/components/common/error/errorMessages";
import React from "react";

describe("Error Messages", () => {
  it("renders 'Network error' in `NetworkError` component", () => {
    render(<NetworkError />);

    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it("renders 'Unknown error' in `UnknownError` component", () => {
    render(<UnknownError />);

    expect(screen.getByText(/Unknown error/)).toBeInTheDocument();
  });
});
