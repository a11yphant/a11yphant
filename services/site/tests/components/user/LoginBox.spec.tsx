import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import LoginBox from "app/components/user/LoginBox";
import LoginForm from "app/components/user/LoginForm";
import React from "react";

const mockShowModal = jest.fn();
const mockHideModal = jest.fn();

jest.mock("app/components/user/LoginForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShowModal,
    hide: mockHideModal,
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
    (LoginForm as jest.Mock).mockImplementation(() => <div>LoginForm</div>);
  });

  it("renders the login form", () => {
    renderLoginBox();

    expect(screen.getByText("LoginForm")).toBeInTheDocument();
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

  it("renders a button to reset the password", () => {
    renderLoginBox();

    expect(screen.getByRole("button", { name: /Forgot your password\? Reset it here/ })).toBeInTheDocument();
  });

  it("switches to the sign up modal on create account button click", () => {
    renderLoginBox();

    screen.getByRole("button", { name: /Create a free account/ }).click();

    expect(mockShowModal).toHaveBeenCalledWith("signup");
  });

  it("closes the modal after a successful login", () => {
    (LoginForm as jest.Mock).mockImplementation((props: Parameters<typeof LoginForm>[0]) => {
      props.onAfterSubmit();
      return <div>LoginForm</div>;
    });
    render(<LoginBox />);

    expect(mockHideModal).toHaveBeenCalled();
  });
});
