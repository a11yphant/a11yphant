import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import LoginBox from "app/components/user/LoginBox";
import React from "react";

const mockShow = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
  }),
}));

function renderLoginBox(): ReturnType<typeof render> {
  return render(
    <MockedProvider>
      <LoginBox />
    </MockedProvider>,
  );
}

describe("login box", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders the login form", () => {
    renderLoginBox();

    expect(screen.getByRole("form", { name: /Login/ })).toBeInTheDocument();
  });

  it("renders the login via github link", () => {
    renderLoginBox();

    expect(screen.getByRole("link", { name: /Log in via Github/ })).toBeInTheDocument();
  });

  it("renders the login via twitter link", () => {
    renderLoginBox();

    expect(screen.getByRole("link", { name: /Log in via Twitter/ })).toBeInTheDocument();
  });

  it("renders a button to create an account", () => {
    renderLoginBox();

    expect(screen.getByRole("button", { name: /Create a free account/ })).toBeInTheDocument();
  });

  it("switches to the sign up modal on create account button click", () => {
    renderLoginBox();

    screen.getByRole("button", { name: /Create a free account/ }).click();

    expect(mockShow).toHaveBeenCalledWith("signup");
  });
});
