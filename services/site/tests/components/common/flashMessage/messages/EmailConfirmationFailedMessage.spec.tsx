import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("renders failed email confirmation message", () => {
    render(<EmailConfirmationFailedMessage />);

    expect(screen.getByText(/Your email could not be confirmed/)).toBeInTheDocument();
  });

  it("renders resend confirmation email button", () => {
    render(<EmailConfirmationFailedMessage />);

    expect(screen.getByRole("button", { name: /Resend Confirmation Email/ })).toBeInTheDocument();
  });

  it("click on resend confirmation email button triggers resendConfirmationEmail mutation", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.Successful } });
    render(<EmailConfirmationFailedMessage />);

    // without act the test fails with an error
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Resend Confirmation Email/ }));
    });

    expect(resendConfirmationEmailMock).toHaveBeenCalledTimes(1);
  });

  it("renders 'check your inbox' if ResendEmailConfirmationResult == SUCCESSFUL", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.Successful } });
    render(<EmailConfirmationFailedMessage />);

    // without act the test fails with an error
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Resend Confirmation Email/ }));
    });

    expect(screen.getByText(/Check your inbox/)).toBeInTheDocument();
  });

  it("renders 'Your email has already been verified' if ResendEmailConfirmationResult == ALREADY_VERIFIED", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.AlreadyVerified } });
    render(<EmailConfirmationFailedMessage />);

    // without act the test fails with an error
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Resend Confirmation Email/ }));
    });

    expect(screen.getByText(/Your email has already been verified/)).toBeInTheDocument();
  });

  it("renders 'Your email has already been verified' if ResendEmailConfirmationResult == NOT_APPLICABLE", async () => {
    resendConfirmationEmailMock.mockReturnValue({ data: { resendConfirmationEmail: ResendEmailConfirmationResultEnum.NotApplicable } });
    render(<EmailConfirmationFailedMessage />);

    // without act the test fails with an error
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Resend Confirmation Email/ }));
    });

    expect(screen.getByText(/Your email has already been verified/)).toBeInTheDocument();
  });
});
