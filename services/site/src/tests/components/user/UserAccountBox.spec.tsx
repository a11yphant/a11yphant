import "@testing-library/jest-dom/extend-expect";

import LoginBox from "app/components/user/LoginBox";
import SignUpBox from "app/components/user/SignUpBox";
import { UserAccountBox } from "app/components/user/UserAccountBox";
import { shallow } from "enzyme";
import React from "react";

describe("UserAccountBox", () => {
  it("renders the sign up options in sign up mode", () => {
    const wrapper = shallow(<UserAccountBox mode="signup" />);

    expect(wrapper.find(SignUpBox).exists()).toBeTruthy();
  });

  it("renders correctly in login mode", () => {
    const wrapper = shallow(<UserAccountBox mode="login" />);

    expect(wrapper.find(LoginBox).exists()).toBeTruthy();
  });
});
