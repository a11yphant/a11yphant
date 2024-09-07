import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import SignUpBox from "app/components/user/SignUpBox";
import SignUpForm from "app/components/user/SignUpForm";
import React from "react";

const mockShowModal = jest.fn();
const mockHideModal = jest.fn();
const mockShowFlashMessage = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShowModal,
    hide: mockHideModal,
  }),
}));

jest.mock("app/components/user/SignUpForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: () => ({
    show: mockShowFlashMessage,
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
    (SignUpForm as jest.Mock).mockImplementation(() => <div>SignUpForm</div>);
  });

  it("renders the sign up form", () => {
    renderSignUpBox();

    expect(screen.getByText("SignUpForm")).toBeInTheDocument();
  });

  it("renders the sign up via github link", () => {
    renderSignUpBox();

    expect(screen.getByRole("link", { name: /Sign Up via Github/ })).toBeInTheDocument();
  });

  it("renders the sign up via twitter link", () => {
    renderSignUpBox();

    expect(screen.getByRole("link", { name: /Sign Up via X\/Twitter/ })).toBeInTheDocument();
  });

  it("renders a button to got to the log in", () => {
    renderSignUpBox();

    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });

  it("opens the login modal on login click", () => {
    renderSignUpBox();

    screen.getByRole("button", { name: /Log in/ }).click();

    expect(mockShowModal).toHaveBeenCalledWith("login");
  });

  it("closes the modal after a successful sign up", () => {
    (SignUpForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>SignUpForm</div>;
    });
    renderSignUpBox();

    expect(mockHideModal).toHaveBeenCalled();
  });

  it("shows flash message after a successful sign up", () => {
    (SignUpForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>SignUpForm</div>;
    });
    renderSignUpBox();

    expect(mockShowFlashMessage).toHaveBeenCalledWith(expect.any(String));
  });
});
