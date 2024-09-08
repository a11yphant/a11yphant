import { act, render, screen } from "@testing-library/react";
import UserAccountModal, { UserAccountModalProps } from "app/components/user/UserAccountModal";
import React from "react";

jest.mock("app/components/user/UserAccountBox", () => ({
  UserAccountBox: () => <></>,
}));

afterEach(() => {
  jest.clearAllMocks();
});

const renderUserAccountModal = async (props: Partial<UserAccountModalProps>): Promise<void> => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(<UserAccountModal open={true} mode="signup" onClose={jest.fn()} {...props} />);
  });
};

describe("UserAccountModal", () => {
  it("renders a closed modal", async () => {
    await renderUserAccountModal({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an open modal", async () => {
    await renderUserAccountModal({ open: true });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders correctly in signup mode", async () => {
    await renderUserAccountModal({ mode: "signup" });

    expect(screen.getByText("Sign up", { exact: false })).toBeInTheDocument();
  });

  it("renders correctly in login mode", async () => {
    await renderUserAccountModal({ mode: "login" });

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
