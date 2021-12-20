import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import SignUpBox from "app/components/user/SignUpBox";
import React from "react";

const mockShow = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
  }),
}));

function renderSignUpBox(): ReturnType<typeof render> {
  return render(
    <MockedProvider>
      <SignUpBox />
    </MockedProvider>,
  );
}

describe("sign up box", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders the sign up form", () => {
    renderSignUpBox();

    expect(screen.getByRole("form", { name: /Sign up/ })).toBeInTheDocument();
  });

  it("renders the sign up via github link", () => {
    renderSignUpBox();

    expect(screen.getByRole("link", { name: /Sign up via Github/ })).toBeInTheDocument();
  });

  it("renders the sign up via twitter link", () => {
    renderSignUpBox();

    expect(screen.getByRole("link", { name: /Sign up via Twitter/ })).toBeInTheDocument();
  });

  it("renders a button to got to the log in", () => {
    renderSignUpBox();

    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });

  it("opens the login modal on login click", () => {
    renderSignUpBox();

    screen.getByRole("button", { name: /Log in/ }).click();

    expect(mockShow).toHaveBeenCalledWith("login");
  });
});
