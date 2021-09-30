import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import Button from "app/components/buttons/Button";
import { UserAccountBox } from "app/components/user/UserAccountBox";
import { shallow } from "enzyme";
import React from "react";

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock("app/components/user/useUserAccountModalApi", () => ({
  useUserAccountModalApi: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("UserAccountBox", () => {
  it("renders correctly in signup mode", () => {
    const wrapper = shallow(<UserAccountBox mode="signup" />);

    // Github button has sign up text
    expect(wrapper.findWhere((n) => n.text() === "Sign up via Github").length).toBeGreaterThanOrEqual(1);

    // "link" to login modal exists
    expect(wrapper.find(Button).findWhere((n) => n.children().length === 1 && n.children().text() === "Already have an account? Log in."));
  });

  it("show login modal on 'link' to login click", () => {
    const wrapper = shallow(<UserAccountBox mode="signup" />);

    wrapper.find(Button).simulate("click");
    wrapper.update();

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow).toHaveBeenCalledWith("login");
  });

  it("renders correctly in login mode", () => {
    const wrapper = shallow(<UserAccountBox mode="login" />);

    // Github button has login text
    expect(wrapper.findWhere((n) => n.text() === "Login with Github").length).toBeGreaterThanOrEqual(1);

    // "link" to signup modal exists
    expect(wrapper.find(Button).findWhere((n) => n.children().length === 1 && n.children().text() === "New? Create a free account."));
  });

  it("show signup modal on 'link' to signup click", () => {
    const wrapper = shallow(<UserAccountBox mode="login" />);

    wrapper.find(Button).simulate("click");
    wrapper.update();

    expect(mockShow).toHaveBeenCalledTimes(1);
    expect(mockShow).toHaveBeenCalledWith("signup");
  });
});
