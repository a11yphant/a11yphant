import "@testing-library/jest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import LoginBox from "app/components/user/LoginBox";
import SignUpBox from "app/components/user/SignUpBox";
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
  it("renders the sign up options in sign up mode", () => {
    const wrapper = shallow(<UserAccountBox mode="signup" />);

    expect(wrapper.find(SignUpBox).exists()).toBeTruthy();
  });

  it("renders correctly in login mode", () => {
    const wrapper = shallow(<UserAccountBox mode="login" />);

    expect(wrapper.find(LoginBox).exists()).toBeTruthy();
  });

  // it("show login modal on 'link' to login click", () => {
  //   const wrapper = shallow(<UserAccountBox mode="signup" />);

  //   wrapper.find(Button).simulate("click");
  //   wrapper.update();

  //   expect(mockShow).toHaveBeenCalledTimes(1);
  //   expect(mockShow).toHaveBeenCalledWith("login");
  // });

  // it("show signup modal on 'link' to signup click", () => {
  //   const wrapper = shallow(<UserAccountBox mode="login" />);

  //   wrapper.find(Button).simulate("click");
  //   wrapper.update();

  //   expect(mockShowh).toHaveBeenCalledTimes(1);
  //   expect(mockShow).toHaveBeenCalledWith("signup");
  // });

  it.todo("shows the login form in login mode");
  it.todo("shows the signup form in signup mode");
  it.todo("closes itself after a successful login");
  it.todo("triggers a refetch of the current user after a login");
  it.todo("shows a success message after a successful registration");
});
