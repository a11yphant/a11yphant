import "@testing-library/jest-dom/extend-expect";

import { Modal } from "app/components/modal/Modal";
import { ModalTitle } from "app/components/modal/ModalTitle";
import { UserAccountBox } from "app/components/user/UserAccountBox";
import UserAccountModal, { UserAccountModalProps } from "app/components/user/UserAccountModal";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

afterEach(() => {
  jest.clearAllMocks();
});

const renderUserAccountModal = (props: Partial<UserAccountModalProps>): ShallowWrapper => {
  return shallow(<UserAccountModal open={true} mode="signup" {...props} />);
};

describe("UserAccountModal", () => {
  it("renders a closed modal", () => {
    const wrapper = renderUserAccountModal({ open: false });

    expect(wrapper.find(Modal).props().open).toBeFalsy();
  });

  it("renders an open modal", () => {
    const wrapper = renderUserAccountModal({ open: true });

    expect(wrapper.find(Modal).props().open).toBeTruthy();
  });

  it("renders correctly in signup mode", () => {
    const wrapper = renderUserAccountModal({ mode: "signup" });

    expect(wrapper.find(ModalTitle).children().text()).toContain("Sign up");
    expect(wrapper.find(UserAccountBox).props().mode).toContain("signup");
  });

  it("renders correctly in login mode", () => {
    const wrapper = renderUserAccountModal({ mode: "login" });

    expect(wrapper.find(ModalTitle).children().text()).toContain("Login");
    expect(wrapper.find(UserAccountBox).props().mode).toContain("login");
  });
});
