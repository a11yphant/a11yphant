import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "app/components/modal/Modal";
import React from "react";

const mockOnClose = jest.fn();

describe("Modal", () => {
  it("renders an open modal", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<Modal open={true} onClose={mockOnClose} />);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders a closed modal", () => {
    render(<Modal open={false} onClose={mockOnClose} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the `children`", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <Modal open={true} onClose={mockOnClose}>
          <p>Child</p>
        </Modal>,
      );
    });

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("calls onClose on `X` button press", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<Modal open={true} onClose={mockOnClose} />);
    });

    await userEvent.click(screen.getByRole("button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
