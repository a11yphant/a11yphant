import { render, screen } from "@testing-library/react";
import UserAccountModal, { UserAccountModalProps } from "app/components/user/UserAccountModal";
import React from "react";

jest.mock("app/components/user/UserAccountBox", () => ({
  UserAccountBox: () => <></>,
}));

afterEach(() => {
  jest.clearAllMocks();
});

const renderUserAccountModal = (props: Partial<UserAccountModalProps>): void => {
  render(<UserAccountModal open={true} mode="signup" onClose={jest.fn()} {...props} />);
};

describe("UserAccountModal", () => {
  it("renders a closed modal", () => {
    renderUserAccountModal({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an open modal", () => {
    renderUserAccountModal({ open: true });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders correctly in signup mode", () => {
    renderUserAccountModal({ mode: "signup" });

    expect(screen.getByText("Sign up", { exact: false })).toBeInTheDocument();
  });

  it("renders correctly in login mode", () => {
    renderUserAccountModal({ mode: "login" });

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
