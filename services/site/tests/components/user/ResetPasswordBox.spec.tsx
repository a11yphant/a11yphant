import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import ResetPasswordBox from "app/components/user/ResetPasswordBox";
import ResetPasswordForm from "app/components/user/ResetPasswordForm";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/components/user/ResetPasswordForm", () => ({
  __esModule: true,
  default: jest.fn(),
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
  beforeEach(() => {
    jest.resetAllMocks();
    (ResetPasswordForm as jest.Mock).mockImplementation(() => <div>ResetPasswordForm</div>);
  });

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

  it("closes the modal after a form submit", () => {
    (ResetPasswordForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>ResetPasswordForm</div>;
    });

    renderResetPasswordBox();

    expect(mockHide).toHaveBeenCalled();
  });
});
