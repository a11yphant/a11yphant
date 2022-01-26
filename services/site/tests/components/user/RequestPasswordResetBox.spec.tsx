import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import RequestPasswordResetBox from "app/components/user/RequestPasswordResetBox";
import RequestPasswordResetForm from "app/components/user/RequestPasswordResetForm";

const mockShowModal = jest.fn();
const mockHideModal = jest.fn();
const mockShowFlashMessage = jest.fn();

jest.mock("app/components/user/RequestPasswordResetForm", () => ({
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

function renderRequestPasswordResetBox(): void {
  render(
    <MockedProvider>
      <RequestPasswordResetBox />
    </MockedProvider>,
  );
}

describe("reset password box", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (RequestPasswordResetForm as jest.Mock).mockImplementation(() => <div>RequestPasswordResetForm</div>);
  });

  it("renders the reset password form", () => {
    renderRequestPasswordResetBox();

    expect(screen.getByText("RequestPasswordResetForm")).toBeInTheDocument();
  });

  it("shows a button to switch to login", () => {
    renderRequestPasswordResetBox();

    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });

  it("opens the login modal when the login button is clicked", () => {
    renderRequestPasswordResetBox();

    fireEvent.click(screen.getByRole("button", { name: /Log in/ }));

    expect(mockShowModal).toHaveBeenCalledWith("login");
  });

  it("shows a button to switch to signup", () => {
    renderRequestPasswordResetBox();

    expect(screen.getByRole("button", { name: /Create a free account/ })).toBeInTheDocument();
  });

  it("opens the signup modal when the signup button is clicked", () => {
    renderRequestPasswordResetBox();

    fireEvent.click(screen.getByRole("button", { name: /Create a free account/ }));

    expect(mockShowModal).toHaveBeenCalledWith("signup");
  });

  it("closes the modal after a form submit", () => {
    (RequestPasswordResetForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>RequestPasswordResetForm</div>;
    });

    renderRequestPasswordResetBox();

    expect(mockHideModal).toHaveBeenCalled();
  });

  it("shows a flash message after a form submit", () => {
    (RequestPasswordResetForm as jest.Mock).mockImplementation(({ onAfterSubmit }) => {
      onAfterSubmit();
      return <div>RequestPasswordResetForm</div>;
    });

    renderRequestPasswordResetBox();

    expect(mockShowFlashMessage).toHaveBeenCalledWith(expect.any(String));
  });
});
