import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import Navigation, { NavigationProps } from "app/components/Navigation";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { useLogoutMutation, User } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import React, { PropsWithChildren } from "react";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/generated/graphql", () => ({
  useLogoutMutation: jest.fn(),
}));

jest.mock("app/components/breadcrumbs/Breadcrumbs", () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumbs"></div>,
}));

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

jest.mock("app/hooks/useCurrentUser", () => ({
  useCurrentUser: jest.fn(),
}));

const renderNavigation = (props?: Partial<PropsWithChildren<NavigationProps>>): void => {
  render(<Navigation {...props} />, { wrapper: FlashMessageContextProvider });
};

const mockRegisteredUser = (): void => {
  (useCurrentUser as jest.Mock<{ currentUser: User }>).mockImplementation(() => ({
    currentUser: {
      id: "mock-id",
      isRegistered: true,
      displayName: "mock-display-name",
      isVerified: true,
    },
  }));
};

const mockNonRegisteredUser = (): void => {
  (useCurrentUser as jest.Mock<{ currentUser: User }>).mockImplementation(() => ({
    currentUser: {
      id: "mock-id",
      isRegistered: false,
      displayName: "mock-display-name",
      isVerified: false,
    },
  }));
};

beforeEach(() => {
  jest.resetAllMocks();
  (useLogoutMutation as jest.Mock).mockReturnValue([jest.fn(), {}]);
});

describe("Navigation", () => {
  it("renders the header", () => {
    mockRegisteredUser();
    renderNavigation();

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the user dropdown if the user is registered", () => {
    mockRegisteredUser();
    renderNavigation();

    expect(screen.getByRole("button", { name: "User Menu" })).toBeInTheDocument();
  });

  it("renders no avatar if the user is not registered", () => {
    mockNonRegisteredUser();
    renderNavigation();

    expect(screen.queryByRole("button", { name: "User Menu" })).not.toBeInTheDocument();
  });

  it("renders the breadcrumbs if they are enabled", () => {
    mockRegisteredUser();
    renderNavigation({ displayBreadcrumbs: true });

    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
  });

  it("renders no breadcrumbs if they are disabled", () => {
    mockRegisteredUser();
    renderNavigation({ displayBreadcrumbs: false });

    expect(screen.queryByTestId("breadcrumbs")).not.toBeInTheDocument();
  });

  it("renders the children", () => {
    mockRegisteredUser();
    renderNavigation({ children: <p data-testid="test-children">children</p> });

    expect(screen.getAllByTestId("test-children")).toHaveLength(2);
  });

  it("renders login and signup buttons if the user is not registered", () => {
    mockNonRegisteredUser();
    renderNavigation();

    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("calls userAccountModalApi.show with the mode 'signup' after a click on `sign up`", async () => {
    mockNonRegisteredUser();
    const userAccountModalApi = useUserAccountModalApi();
    renderNavigation();

    const login = screen.getByRole("button", { name: "Sign Up" });
    await userEvent.click(login);

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("signup");
  });

  it("calls userAccountModalApi.show with the mode 'login' after a click on `login` ", async () => {
    mockNonRegisteredUser();
    const userAccountModalApi = useUserAccountModalApi();
    renderNavigation();

    const login = screen.getByRole("button", { name: "Login" });
    await userEvent.click(login);

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("login");
  });

  it("calls the logout mutation after a click on logout", async () => {
    mockRegisteredUser();
    const logoutMutation = useLogoutMutation();
    renderNavigation();

    const login = screen.getByRole("button", { name: "User Menu" });
    await userEvent.click(login);

    const logout = screen.getByRole("menuitem", { name: "Logout" });
    await userEvent.click(logout);

    expect(logoutMutation[0]).toHaveBeenCalledTimes(1);
  });
});
