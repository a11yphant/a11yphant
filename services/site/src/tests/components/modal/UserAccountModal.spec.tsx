import "@testing-library/jest-dom/extend-expect";

import { Dialog } from "@headlessui/react";
import { cleanup } from "@testing-library/react";
import { UserAccountBox } from "app/components/auth/UserAccountBox";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import UserAccountModal, { UserAccountModalProps } from "app/components/modal/UserAccountModal";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

const mockOnClose = jest.fn();

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const renderUserAccountModal = (props: Partial<UserAccountModalProps>): ShallowWrapper => {
  return shallow(<UserAccountModal open={true} mode="signup" {...props} />);
};

describe("UserAccountModal", () => {
  it("is closed", () => {
    const wrapper = renderUserAccountModal({ open: false });

    expect(wrapper.find(Dialog).props().open).toBeFalsy();
  });

  it("is open", () => {
    const wrapper = renderUserAccountModal({ open: true });

    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  it("renders correctly in signup mode", () => {
    const wrapper = renderUserAccountModal({ mode: "signup" });

    expect(wrapper.find(Dialog.Title).children().text()).toContain("Sign up");
    expect(wrapper.find(UserAccountBox).props().mode).toContain("signup");
  });

  it("renders correctly in login mode", () => {
    const wrapper = renderUserAccountModal({ mode: "login" });

    expect(wrapper.find(Dialog.Title).children().text()).toContain("Login");
    expect(wrapper.find(UserAccountBox).props().mode).toContain("login");
  });

  it("calls onClose on X press", () => {
    const wrapper = renderUserAccountModal({ onClose: mockOnClose });

    wrapper.find(X).closest(Button).simulate("click");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
