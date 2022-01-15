import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ResetPasswordForm from "app/components/user/ResetPasswordForm";
import React from "react";

describe("reset password form", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders a email input", () => {
    render(<ResetPasswordForm />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<ResetPasswordForm />);
    expect(screen.getByRole("button", { name: /Reset password/ })).toBeInTheDocument();
  });

  it("calls the onAfterSubmit callback if the form is sent successfully", async () => {
    const email = "test@a11yphant.com";

    const onAfterSubmit = jest.fn();

    render(<ResetPasswordForm onAfterSubmit={onAfterSubmit} />);

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(emailInput).toHaveValue(email));

    expect(onAfterSubmit).toHaveBeenCalled();
  });

  it("does not call onSubmit if the form does not filled out", async () => {
    const onSubmit = jest.fn();

    render(<ResetPasswordForm onAfterSubmit={onSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("The email address is required");

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
