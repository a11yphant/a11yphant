import "@testing-library/jest-dom/extend-expect";

import { Dialog } from "@headlessui/react";
import { cleanup } from "@testing-library/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import UserAccountModal, { UserAccountModalProps } from "app/components/modal/UserAccountModal";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

const mockTitle = "Mock Login Modal Title";
const mockLoginLink = "Already have an account? Log in.";
const mockRegistrationLink = "New? Create a free account.";
const mockResetLink = "Forgot your password? Reset.";
const mockOnClose = jest.fn();

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const renderUserAccountModal = (props?: Partial<UserAccountModalProps>): ShallowWrapper => {
  return shallow(<UserAccountModal open={true} title={mockTitle} signUp={true} {...props} />);
};

describe("UserAccountModal", () => {
  it("is closed", () => {
    const wrapper = renderUserAccountModal({ open: false });

    expect(wrapper.find(Dialog).props().open).toBeFalsy();
  });

  it("is opened", () => {
    const wrapper = renderUserAccountModal({ open: true });

    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  it("shows title", () => {
    const wrapper = renderUserAccountModal({ title: mockTitle });

    expect(wrapper.find<{ children: React.ReactNode }>(Dialog.Title).props().children).toContain(mockTitle);
  });

  it("shows GitHub login", () => {
    const wrapper = renderUserAccountModal({ showGithubLogin: true });

    expect(wrapper.find("a").contains("<GitHub />"));
  });

  it("shows login link", () => {
    const wrapper = renderUserAccountModal({ loginLinkText: mockLoginLink });

    expect(wrapper.find("a").text()).toBe(mockLoginLink);
  });

  it("shows registration link", () => {
    const wrapper = renderUserAccountModal({ registrationLinkText: mockRegistrationLink });

    expect(wrapper.find("a").text()).toBe(mockRegistrationLink);
  });

  it("shows password reset link", () => {
    const wrapper = renderUserAccountModal({ resetLinkText: mockResetLink });

    expect(wrapper.find("a").text()).toBe(mockResetLink);
  });

  it("calls onClose on X press", () => {
    const wrapper = renderUserAccountModal({ onClose: mockOnClose });

    wrapper.find(X).closest(Button).simulate("click");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
