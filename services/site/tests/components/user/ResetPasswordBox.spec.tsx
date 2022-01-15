import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import ResetPasswordBox from "app/components/user/ResetPasswordBox";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/components/user/ResetPasswordForm", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div>ResetPasswordForm</div>),
}));

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

function renderResetPasswordBox(): void {
  render(
    <MockedProvider>
      <ResetPasswordBox />
    </MockedProvider>,
  );
}

describe("reset password box", () => {
  it("renders the reset password form", () => {
    renderResetPasswordBox();

    expect(screen.getByText("ResetPasswordForm")).toBeInTheDocument();
  });

  it("shows a button to switch to login", () => {
    renderResetPasswordBox();

    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });

  it("shows a button to switch to signup", () => {
    renderResetPasswordBox();

    expect(screen.getByRole("button", { name: /Create a free account/ })).toBeInTheDocument();
  });
});
