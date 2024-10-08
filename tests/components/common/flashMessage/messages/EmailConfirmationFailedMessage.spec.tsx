import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailConfirmationFailedMessage } from "app/components/common/flashMessage/messages/EmailConfirmationFailedMessage";
import { ResendEmailConfirmationResultEnum, useResendConfirmationEmailMutation } from "app/generated/graphql";
import React from "react";

const resendConfirmationEmailMock = jest.fn();

jest.mock("app/generated/graphql");

describe("EmailConfirmationFailedMessage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useResendConfirmationEmailMutation as jest.Mock).mockImplementation(() => [resendConfirmationEmailMock, { loading: false }]);
  });

  it("renders failed e-mail confirmation message", () => {
    render(<EmailConfirmationFailedMessage />);

    expect(screen.getByText(/Your e-mail could not be confirmed./)).toBeInTheDocument();
  });

  it("renders resend confirmation e-mail button", () => {
    render(<EmailConfirmationFailedMessage />);

    expect(screen.getByRole("button", { name: /Resend confirmation e-mail/ })).toBeInTheDocument();
  });

  it("click on resend confirmation e-mail button triggers resendConfirmationEmail mutation", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.Successful } });
    render(<EmailConfirmationFailedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /Resend confirmation e-mail/ }));

    expect(resendConfirmationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("renders 'check your inbox' if ResendEmailConfirmationResult == SUCCESSFUL", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.Successful } });
    render(<EmailConfirmationFailedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /Resend confirmation e-mail/ }));

    expect(screen.getByText(/Check your inbox/)).toBeInTheDocument();
  });

  it("renders 'Your e-mail has already been verified' if ResendEmailConfirmationResult == ALREADY_VERIFIED", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.AlreadyVerified } });
    render(<EmailConfirmationFailedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /Resend confirmation e-mail/ }));

    expect(screen.getByText(/Your e-mail has already been verified/)).toBeInTheDocument();
  });

  it("renders 'Your e-mail has already been verified' if ResendEmailConfirmationResult == NOT_APPLICABLE", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.NotApplicable } });
    render(<EmailConfirmationFailedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /Resend confirmation e-mail/ }));

    expect(screen.getByText(/Your e-mail has already been verified/)).toBeInTheDocument();
  });
});
