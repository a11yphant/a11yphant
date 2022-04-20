import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import PasswordResetForm from "app/components/passwordReset/PasswordResetForm";
import { ResetPasswordDocument, ResetPasswordFields, ResetPasswordMutation, ResetPasswordResultEnum } from "app/generated/graphql";
import React from "react";

function renderPasswordResetForm({ onAfterSubmit, responses }: { onAfterSubmit?: () => {}; responses?: MockedResponse[] } = {}): void {
  render(
    <MockedProvider mocks={responses}>
      <PasswordResetForm token="token" onAfterSubmit={onAfterSubmit} />
    </MockedProvider>,
  );
}

describe("password reset form", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders a password input", () => {
    renderPasswordResetForm();
    expect(screen.getByLabelText(/New Password/)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderPasswordResetForm();
    expect(screen.getByRole("button", { name: /Reset password/ })).toBeInTheDocument();
  });

  it("calls the onAfterSubmit callback if the form is sent successfully", async () => {
    const password = "verysecret";
    const response: MockedResponse<ResetPasswordMutation> = {
      request: {
        query: ResetPasswordDocument,
        variables: {
          token: "token",
          password,
        },
      },
      result: {
        data: {
          resetPassword: {
            __typename: "User",
          },
        },
      },
    };

    const onAfterSubmit = jest.fn();

    renderPasswordResetForm({ onAfterSubmit, responses: [response] });

    const passwordInput = screen.getByLabelText(/New Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    // wait for the mutation to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(onAfterSubmit).toHaveBeenCalled();
  });

  it("does not call onSubmit if the form is not filled out", async () => {
    const onAfterSubmit = jest.fn();

    renderPasswordResetForm({ onAfterSubmit });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("The new password is required");

    expect(onAfterSubmit).not.toHaveBeenCalled();
  });

  it("shows an error if the server side password validation fails", async () => {
    const password = "verysecret";
    const response: MockedResponse<ResetPasswordMutation> = {
      request: {
        query: ResetPasswordDocument,
        variables: {
          token: "token",
          password,
        },
      },
      result: {
        data: {
          resetPassword: {
            __typename: "ResetPasswordErrorResult",
            errorCode: ResetPasswordResultEnum.InputValidationError,
            inputErrors: [
              {
                field: ResetPasswordFields.Password,
                message: "The password must be at least 8 characters long.",
              },
            ],
          },
        },
      },
    };

    renderPasswordResetForm({ responses: [response] });

    const passwordInput = screen.getByLabelText(/New Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(await screen.findByText("The password must be at least 8 characters long.")).toBeInTheDocument();
  });
});
