import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import UserAvatar from "app/components/icons/UserAvatar";
import Navigation, { NavigationProps } from "app/components/Navigation";
import { shallow, ShallowWrapper } from "enzyme";
import React, { PropsWithChildren } from "react";

jest.mock("app/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({
    currentUser: {
      id: "mock-id",
    },
  }),
}));

const renderNavigation = (props?: Partial<PropsWithChildren<NavigationProps>>): ShallowWrapper => {
  return shallow(<Navigation {...props} />);
};

afterEach(cleanup);

describe("Navigation", () => {
  it("renders correctly", () => {
    const wrapper = renderNavigation();

    // Wrapper exists
    expect(wrapper.exists("header")).toBeTruthy();

    // Logo and Link exist
    expect(wrapper.find("h1")).toHaveProperty("length", 1);
    expect(wrapper.exists(A11yphantLogo)).toBeTruthy();

    // Breadcrumbs exist
    expect(wrapper.exists(Breadcrumbs)).toBeTruthy();

    // User Avatar exists
    expect(wrapper.exists(UserAvatar)).toBeFalsy();
  });

  it("with breadcrumbs", () => {
    const wrapper = renderNavigation({ displayBreadcrumbs: true });

    // Breadcrumbs exist
    expect(wrapper.exists(Breadcrumbs)).toBeTruthy();
  });

  it("without breadcrumbs", () => {
    const wrapper = renderNavigation({ displayBreadcrumbs: false });

    // Breadcrumbs do not exist
    expect(wrapper.exists(Breadcrumbs)).toBeFalsy();
  });

  it("with children", () => {
    const wrapper = renderNavigation({ children: <p className="test-children">children</p> });

    // Children do exist
    expect(wrapper.exists(".test-children")).toBeTruthy();
  });
});
