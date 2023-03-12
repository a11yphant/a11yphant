import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import Button from "app/components/buttons/Button";
import Dropdown from "app/components/common/dropdown/Dropdown";
import { FlashMessageContextProvider } from "app/components/common/flashMessage/FlashMessageContext";
import { FlashMessagePortalRoot } from "app/components/common/flashMessage/FlashMessagePortalRoot";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import UserAvatar from "app/components/icons/UserAvatar";
import Navigation, { NavigationProps } from "app/components/Navigation";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { useLogoutMutation, User } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import { shallow, ShallowWrapper } from "enzyme";
import React, { PropsWithChildren } from "react";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/generated/graphql", () => ({
  useLogoutMutation: jest.fn(),
}));

jest.mock("app/components/breadcrumbs/Breadcrumbs", () => ({
  __esModule: true,
  default: () => <></>,
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

let navigation;

beforeEach(() => {
  navigation = <Navigation />;
});

const shallowRenderNavigation = (props?: Partial<PropsWithChildren<NavigationProps>>): ShallowWrapper => {
  return shallow(
    React.cloneElement(navigation, {
      ...props,
    }),
  );
};

const renderNavigation = (props?: Partial<PropsWithChildren<NavigationProps>>): void => {
  render(
    React.cloneElement(navigation, {
      ...props,
    }),
    { wrapper: FlashMessageContextProvider },
  );
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
  it("renders the header, logo and breadcrumbs", () => {
    mockRegisteredUser();
    const view = shallowRenderNavigation();

    expect(view.exists("header")).toBeTruthy();
    expect(view.exists(A11yphantLogo)).toBeTruthy();
  });

  it("renders the user dropdown if the user is registered", () => {
    mockRegisteredUser();
    const view = shallowRenderNavigation();

    expect(view.exists(Dropdown)).toBeTruthy();
  });

  it("renders no avatar if the user is not registered", () => {
    mockNonRegisteredUser();
    const view = shallowRenderNavigation();

    expect(view.exists(UserAvatar)).toBeFalsy();
  });

  it("renders the breadcrumbs if they are enabled", () => {
    mockRegisteredUser();
    const view = shallowRenderNavigation({ displayBreadcrumbs: true });

    expect(view.exists(Breadcrumbs)).toBeTruthy();
  });

  it("renders no breadcrumbs if they are disabled", () => {
    mockRegisteredUser();
    const view = shallowRenderNavigation({ displayBreadcrumbs: false });

    expect(view.exists(Breadcrumbs)).toBeFalsy();
  });

  it("renders the children", () => {
    mockRegisteredUser();
    const view = shallowRenderNavigation({ children: <p className="test-children">children</p> });

    expect(view.exists(".test-children")).toBeTruthy();
  });

  it("renders login and signup buttons if the user is not registered", () => {
    mockNonRegisteredUser();
    const view = shallowRenderNavigation();

    expect(view.find(Button).length).toBe(2);
  });

  it("renders a FlashMessagePortalRoot", () => {
    mockRegisteredUser();
    const view = shallowRenderNavigation();

    expect(view.exists(FlashMessagePortalRoot)).toBeTruthy();
  });

  it("calls userAccountModalApi.show with the mode 'signup' after a click on `sign up`", async () => {
    mockNonRegisteredUser();
    const userAccountModalApi = useUserAccountModalApi();
    renderNavigation();

    screen.getByRole("button", { name: "Sign Up" }).click();

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("signup");
  });

  it("calls userAccountModalApi.show with the mode 'login' after a click on `login` ", async () => {
    mockNonRegisteredUser();
    const userAccountModalApi = useUserAccountModalApi();
    renderNavigation();

    screen.getByRole("button", { name: "Login" }).click();

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("login");
  });

  it("calls the logout mutation after a click on logout", async () => {
    mockRegisteredUser();
    const logoutMutation = useLogoutMutation();
    renderNavigation();

    screen.getByRole("button", { name: "User Menu" }).click();

    (await screen.findByRole("menuitem", { name: "Logout" })).click();

    expect(logoutMutation[0]).toHaveBeenCalledTimes(1);
  });
});
