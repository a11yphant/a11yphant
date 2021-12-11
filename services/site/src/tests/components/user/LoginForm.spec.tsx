import { render, screen } from "@testing-library/react";
import LoginForm from "app/components/user/LoginForm";
import { useLoginMutation } from "app/generated/graphql";
import React from "react";

jest.mock("app/generated/graphql", () => ({
  useLoginMutation: jest.fn(),
}));

describe("login form", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useLoginMutation as jest.Mock).mockReturnValue([jest.fn().mockResolvedValue(null), { loading: false }]);
  });

  it("renders a email input", () => {
    render(<LoginForm />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("renders a password input", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });
});
