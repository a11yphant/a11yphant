import { render, screen } from "@testing-library/react";
import ConfirmationModal, { ConfirmationModalProps } from "app/components/modal/ConfirmationModal";
import React from "react";

const mockTitle = "Mock Confirmation Modal Title";
const mockCancelButtonLabel = "Mock Cancel";
const mockOnCancel = jest.fn();
const mockConfirmButtonLabel = "Mock Confirm";
const mockOnConfirm = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const renderConfirmationModal = (props?: Partial<ConfirmationModalProps>): void => {
  render(<ConfirmationModal open={true} title={mockTitle} onCancel={mockOnCancel} {...props} />);
};

describe("ConfirmationModal", () => {
  it("renders a closed modal", () => {
    renderConfirmationModal({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an open modal", () => {
    renderConfirmationModal({ open: true });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders the title", () => {
    renderConfirmationModal({ title: mockTitle });

    expect(screen.getByRole("heading", { name: mockTitle })).toBeInTheDocument();
  });

  it("renders the default `cancelButtonLabel`", () => {
    renderConfirmationModal();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders a custom `cancelButtonLabel`", () => {
    renderConfirmationModal({ cancelButtonLabel: mockCancelButtonLabel });

    expect(screen.getByRole("button", { name: mockCancelButtonLabel })).toBeInTheDocument();
  });

  it("renders the default `confirmButtonLabel`", () => {
    renderConfirmationModal();

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("renders a custom `confirmButtonLabel`", () => {
    renderConfirmationModal({ confirmButtonLabel: mockConfirmButtonLabel });

    expect(screen.getByRole("button", { name: mockConfirmButtonLabel })).toBeInTheDocument();
  });

  it("calls onCancel on `Cancel` press", () => {
    renderConfirmationModal({ onCancel: mockOnCancel });

    screen.getByRole("button", { name: "Cancel" }).click();
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm on `Confirm` press", async () => {
    renderConfirmationModal({ confirmButtonLabel: mockConfirmButtonLabel, onConfirm: mockOnConfirm });

    screen.getByRole("button", { name: mockConfirmButtonLabel }).click();
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
