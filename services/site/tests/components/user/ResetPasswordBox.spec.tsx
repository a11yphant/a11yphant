import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import ResetPasswordBox from "app/components/user/ResetPasswordBox";
import ResetPasswordForm from "app/components/user/ResetPasswordForm";

const mockShowModal = jest.fn();
const mockHideModal = jest.fn();
const mockShowFlashMessage = jest.fn();

jest.mock("app/components/user/ResetPasswordForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShowModal,
    hide: mockHideModal,
  }),
}));

jest.mock("app/components/common/flashMessage/FlashMessageContext", () => ({
  useFlashMessageApi: () => ({
    show: mockShowFlashMessage,
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

  it("opens the login modal when the login button is clicked", () => {
    renderResetPasswordBox();

    fireEvent.click(screen.getByRole("button", { name: /Log in/ }));

    expect(mockShowModal).toHaveBeenCalledWith("login");
  });

  it("shows a button to switch to signup", () => {
    renderResetPasswordBox();

    expect(screen.getByRole("button", { name: /Create a free account/ })).toBeInTheDocument();
  });

  it("opens the signup modal when the signup button is clicked", () => {
    renderResetPasswordBox();

    fireEvent.click(screen.getByRole("button", { name: /Create a free account/ }));

    expect(mockShowModal).toHaveBeenCalledWith("signup");
  });

  it("closes the modal after a form submit", () => {
    (ResetPasswordForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>ResetPasswordForm</div>;
    });

    renderResetPasswordBox();

    expect(mockHideModal).toHaveBeenCalled();
  });

  it("shows a flash message after a form submit", () => {
    (ResetPasswordForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>ResetPasswordForm</div>;
    });

    renderResetPasswordBox();

    expect(mockShowFlashMessage).toHaveBeenCalledWith(expect.any(String));
  });
});
