import "@testing-library/jest-dom/extend-expect";

import { Dialog } from "@headlessui/react";
import { cleanup } from "@testing-library/react";
import Button from "app/components/buttons/Button";
import X from "app/components/icons/X";
import ConfirmationModal, { ConfirmationModalProps } from "app/components/modal/ConfirmationModal";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";

const mockTitle = "Mock Confirmation Modal Title";
const mockCancelButtonLabel = "Mock Cancel";
const mockOnCancel = jest.fn();
const mockConfirmButtonLabel = "Mock Confirm";
const mockOnConfirm = jest.fn();

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const renderConfirmationModal = (props?: Partial<ConfirmationModalProps>): ShallowWrapper => {
  return shallow(<ConfirmationModal open={true} title={mockTitle} onCancel={mockOnCancel} {...props} />);
};

describe("ConfirmationModal", () => {
  it("is closed", () => {
    const wrapper = renderConfirmationModal({ open: false });

    expect(wrapper.find(Dialog).props().open).toBeFalsy();
  });

  it("is opened", () => {
    const wrapper = renderConfirmationModal({ open: true });

    expect(wrapper.find(Dialog).props().open).toBeTruthy();
  });

  it("shows title", () => {
    const wrapper = renderConfirmationModal({ title: mockTitle });

    expect(wrapper.find(Dialog.Title).children().text()).toContain(mockTitle);
  });

  it("shows default cancelButtonLabel", () => {
    const wrapper = renderConfirmationModal();

    expect(wrapper.find(Button).findWhere((n) => n.text() === "Cancel")).toBeTruthy();
  });

  it("shows cancelButtonLabel", () => {
    const wrapper = renderConfirmationModal({ cancelButtonLabel: mockCancelButtonLabel });

    expect(wrapper.find(Button).findWhere((n) => n.text() === mockCancelButtonLabel)).toBeTruthy();
  });

  it("shows default confirmButtonLabel", () => {
    const wrapper = renderConfirmationModal();

    expect(wrapper.find(Button).findWhere((n) => n.text() === "Confirm")).toBeTruthy();
  });

  it("shows confirmButtonLabel", () => {
    const wrapper = renderConfirmationModal({ confirmButtonLabel: mockConfirmButtonLabel });

    expect(wrapper.find(Button).findWhere((n) => n.text() === mockConfirmButtonLabel)).toBeTruthy();
  });

  it("calls onCancel on X press", () => {
    const wrapper = renderConfirmationModal({ onCancel: mockOnCancel });

    wrapper.find(X).closest(Button).simulate("click");
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel on Cancel press", () => {
    const wrapper = renderConfirmationModal({ cancelButtonLabel: mockCancelButtonLabel, onCancel: mockOnCancel });

    wrapper
      .find(Button)
      .findWhere((n) => n.text() === mockCancelButtonLabel)
      .closest(Button)
      .simulate("click");
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm on Confirm press", async () => {
    const wrapper = renderConfirmationModal({ confirmButtonLabel: mockConfirmButtonLabel, onConfirm: mockOnConfirm });

    wrapper
      .find(Button)
      .findWhere((n) => n.text() === mockConfirmButtonLabel)
      .closest(Button)
      .simulate("click");
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
