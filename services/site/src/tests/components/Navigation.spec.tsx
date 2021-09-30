import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import Button from "app/components/buttons/Button";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import UserAvatar from "app/components/icons/UserAvatar";
import Navigation, { NavigationProps } from "app/components/Navigation";
import { useUserAccountModalApi } from "app/components/user/useUserAccountModalApi";
import { User } from "app/generated/graphql";
import { useCurrentUser } from "app/hooks/useCurrentUser";
import { shallow, ShallowWrapper } from "enzyme";
import { Mock } from "jest-mock";
import React, { PropsWithChildren } from "react";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

jest.mock("app/hooks/useCurrentUser", () => ({
  useCurrentUser: jest.fn(),
}));

const renderNavigation = (props?: Partial<PropsWithChildren<NavigationProps>>): ShallowWrapper => {
  return shallow(<Navigation {...props} />);
};

const mockRegisteredUser = (): void => {
  (useCurrentUser as Mock<{ currentUser: User }>).mockImplementation(() => ({
    currentUser: {
      id: "mock-id",
      isRegistered: true,
    },
  }));
};

const mockNonRegisteredUser = (): void => {
  (useCurrentUser as Mock<{ currentUser: User }>).mockImplementation(() => ({
    currentUser: {
      id: "mock-id",
      isRegistered: false,
    },
  }));
};

afterEach(cleanup);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Navigation", () => {
  it("renders correctly", () => {
    mockRegisteredUser();
    const wrapper = renderNavigation();

    // Wrapper exists
    expect(wrapper.exists("header")).toBeTruthy();

    // Logo and Link exist
    expect(wrapper.find("h1")).toHaveProperty("length", 1);
    expect(wrapper.exists(A11yphantLogo)).toBeTruthy();

    // Breadcrumbs exist
    expect(wrapper.exists(Breadcrumbs)).toBeTruthy();
  });

  it("avatar exists if user is registered", () => {
    mockRegisteredUser();
    const wrapper = renderNavigation();

    expect(wrapper.exists(UserAvatar)).toBeTruthy();
  });

  it("avatar doesn't exist if user is not registered", () => {
    mockNonRegisteredUser();
    const wrapper = renderNavigation();

    expect(wrapper.exists(UserAvatar)).toBeFalsy();
  });

  it("with breadcrumbs", () => {
    mockRegisteredUser();
    const wrapper = renderNavigation({ displayBreadcrumbs: true });

    // Breadcrumbs exist
    expect(wrapper.exists(Breadcrumbs)).toBeTruthy();
  });

  it("without breadcrumbs", () => {
    mockRegisteredUser();
    const wrapper = renderNavigation({ displayBreadcrumbs: false });

    // Breadcrumbs do not exist
    expect(wrapper.exists(Breadcrumbs)).toBeFalsy();
  });

  it("with children", () => {
    mockRegisteredUser();
    const wrapper = renderNavigation({ children: <p className="test-children">children</p> });

    // Children do exist
    expect(wrapper.exists(".test-children")).toBeTruthy();
  });

  it("login and signup buttons exist if user is not registered", () => {
    mockNonRegisteredUser();
    const wrapper = renderNavigation();

    expect(wrapper.find(Button).length).toBe(2);
  });

  it("sign up click calls userAccountModalApi.show with mode 'signup'", async () => {
    mockNonRegisteredUser();
    const userAccountModalApi = useUserAccountModalApi();
    const wrapper = renderNavigation();

    wrapper
      .find(Button)
      .findWhere((n) => {
        return n.children().length === 1 && n.children().text() === "Sign Up";
      })
      .simulate("click");
    wrapper.update();

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("signup");
  });

  it("login click calls userAccountModalApi.show with mode 'login'", async () => {
    mockNonRegisteredUser();
    const userAccountModalApi = useUserAccountModalApi();
    const wrapper = renderNavigation();

    wrapper
      .find(Button)
      .findWhere((n) => {
        return n.children().length === 1 && n.children().text() === "Login";
      })
      .simulate("click");
    wrapper.update();

    expect(userAccountModalApi.show).toHaveBeenCalledTimes(1);
    expect(userAccountModalApi.show).toHaveBeenCalledWith("login");
  });
});
