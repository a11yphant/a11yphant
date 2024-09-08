import { render, screen } from "@testing-library/react";
import { EmailConfirmationSuccessfulMessage } from "app/components/common/flashMessage/messages/EmailConfirmationSuccessfulMessage";
import React from "react";

describe("EmailConfirmationSuccessfulMessage", () => {
  it("renders successful e-mail confirmation message", () => {
    render(<EmailConfirmationSuccessfulMessage />);

    expect(screen.getByText(/Your e-mail was confirmed successfully/)).toBeInTheDocument();
  });
});
