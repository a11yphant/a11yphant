import { render, screen } from "@testing-library/react";
import UserAccountModal from "app/components/user/UserAccountModal";
import { UserAccountModalProvider } from "app/components/user/UserAccountModalProvider";
import React from "react";

jest.mock("app/components/user/UserAccountModal", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  (UserAccountModal as jest.Mock).mockImplementation(() => <></>);
});

describe("UserAccountModalProvider", () => {
  it("renders the UserAccountModal", () => {
    render(<UserAccountModalProvider />);

    expect(UserAccountModal).toHaveBeenCalled();
  });

  it("renders the children", () => {
    render(
      <UserAccountModalProvider>
        <p>Child</p>
      </UserAccountModalProvider>,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
