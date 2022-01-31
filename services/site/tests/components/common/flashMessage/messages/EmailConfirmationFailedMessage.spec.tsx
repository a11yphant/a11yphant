import { render, screen } from "@testing-library/react";
import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import React from "react";

describe("EmailConfirmationFailedMessage", () => {
  it("renders failed email confirmation message", () => {
    render(<EmailConfirmationFailedMessage />);

    expect(screen.getByText(/Your email could not be confirmed/)).toBeInTheDocument();
  });
});
