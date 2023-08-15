import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { UserAccountBox, UserAccountBoxProps } from "app/components/user/UserAccountBox";
import React from "react";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

const renderUserAccountBox = ({ mode, ...props }: Partial<UserAccountBoxProps>): void => {
  render(
    <MockedProvider>
      <UserAccountBox mode={mode} {...props} />
    </MockedProvider>,
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("UserAccountBox", () => {
  it("renders correctly in signup mode", () => {
    renderUserAccountBox({ mode: "signup" });

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });

  it("show login modal on 'link' to login click", () => {
    renderUserAccountBox({ mode: "signup" });

    screen.getByRole("button", { name: /Log in/ }).click();

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow).toHaveBeenCalledWith("login");
  });

  it("renders correctly in login mode", () => {
    renderUserAccountBox({ mode: "login" });

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Create a free account/ })).toBeInTheDocument();
  });

  it("show signup modal on 'link' to signup click", () => {
    renderUserAccountBox({ mode: "login" });

    screen.getByRole("button", { name: /Create a free account/ }).click();

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow).toHaveBeenCalledWith("signup");
  });
});
