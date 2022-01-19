import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ResetPasswordForm from "app/components/user/ResetPasswordForm";
import {
  RequestPasswordResetDocument,
  RequestPasswordResetErrorCodes,
  RequestPasswordResetFields,
  RequestPasswordResetMutation,
  RequestPasswordResetSuccessResultEnum,
} from "app/generated/graphql";
import React from "react";

function renderResetPasswordForm({ onAfterSubmit, responses }: { onAfterSubmit?: () => {}; responses?: MockedResponse[] } = {}): void {
  render(
    <MockedProvider mocks={responses}>
      <ResetPasswordForm onAfterSubmit={onAfterSubmit} />
    </MockedProvider>,
  );
}

describe("reset password form", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders a email input", () => {
    renderResetPasswordForm();
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderResetPasswordForm();
    expect(screen.getByRole("button", { name: /Reset password/ })).toBeInTheDocument();
  });

  it("calls the onAfterSubmit callback if the form is sent successfully", async () => {
    const email = "test@a11yphant.com";
    const response: MockedResponse<RequestPasswordResetMutation> = {
      request: {
        query: RequestPasswordResetDocument,
        variables: {
          email,
        },
      },
      result: {
        data: {
          requestPasswordReset: {
            __typename: "RequestPasswordResetSuccessResult",
            result: RequestPasswordResetSuccessResultEnum.EmailSent,
          },
        },
      },
    };

    const onAfterSubmit = jest.fn();

    renderResetPasswordForm({ onAfterSubmit, responses: [response] });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(emailInput).toHaveValue(email));

    expect(onAfterSubmit).toHaveBeenCalled();
  });

  it("does not call onSubmit if the form is not filled out", async () => {
    const onAfterSubmit = jest.fn();

    renderResetPasswordForm({ onAfterSubmit });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("The email address is required");

    expect(onAfterSubmit).not.toHaveBeenCalled();
  });

  it("shows an error if the server side email validation mutation fails", async () => {
    const email = "user@a11yphant.com";
    const response: MockedResponse<RequestPasswordResetMutation> = {
      request: {
        query: RequestPasswordResetDocument,
        variables: {
          email,
        },
      },
      result: {
        data: {
          requestPasswordReset: {
            __typename: "RequestPasswordResetErrorResult",
            errorCode: RequestPasswordResetErrorCodes.InputValidationError,
            inputErrors: [
              {
                field: RequestPasswordResetFields.Email,
                message: "The email is not valid",
              },
            ],
          },
        },
      },
    };

    renderResetPasswordForm({ responses: [response] });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(await screen.findByText("The email is not valid")).toBeInTheDocument();
  });
});
