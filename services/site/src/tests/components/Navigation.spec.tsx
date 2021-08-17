import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import Breadcrumbs from "app/components/breadcrumbs/Breadcrumbs";
import Button from "app/components/buttons/Button";
import A11yphantLogo from "app/components/icons/A11yphantLogo";
import Save from "app/components/icons/Save";
import UserAvatar from "app/components/icons/UserAvatar";
import Navigation from "app/components/Navigation";
import { shallow } from "enzyme";
import React from "react";

afterEach(cleanup);

describe("Navigation", () => {
  it("renders correctly", () => {
    const wrapper = shallow(<Navigation />);

    // Wrapper exists
    expect(wrapper.type()).toBe("header");

    // Logo and Link exist
    expect(wrapper.find("h1")).toHaveProperty("length", 1);
    expect(wrapper.exists(A11yphantLogo)).toBeTruthy();

    // Breadcrumbs exist
    expect(wrapper.exists(Breadcrumbs)).toBeTruthy();

    // Save does not exist
    expect(wrapper.exists(Save)).toBeFalsy();

    // User Avatar exists
    expect(wrapper.exists(UserAvatar)).toBeFalsy();

    // SignUp/Login Buttons do not exist
    expect(wrapper.exists(Button)).toBeFalsy();
  });

  it("with breadcrumbs", () => {
    const wrapper = shallow(<Navigation displayBreadcrumbs={true} />);

    // Breadcrumbs exist
    expect(wrapper.exists(Breadcrumbs)).toBeTruthy();
  });

  it("without breadcrumbs", () => {
    const wrapper = shallow(<Navigation displayBreadcrumbs={false} />);

    // Breadcrumbs do not exist
    expect(wrapper.exists(Breadcrumbs)).toBeFalsy();
  });

  it("with save", () => {
    const wrapper = shallow(<Navigation displaySave={true} />);

    // Save exists
    expect(wrapper.exists(Save)).toBeTruthy();
  });

  it("without save", () => {
    const wrapper = shallow(<Navigation displaySave={false} />);

    // Save does not exist
    expect(wrapper.exists(Save)).toBeFalsy();
  });
});
