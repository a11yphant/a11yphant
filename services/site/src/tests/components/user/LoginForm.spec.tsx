import { ApolloError } from "@apollo/client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "app/components/user/LoginForm";
import { useLoginMutation } from "app/generated/graphql";
import React from "react";

jest.mock("app/generated/graphql", () => ({
  useLoginMutation: jest.fn(),
}));

describe("login form", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useLoginMutation as jest.Mock).mockReturnValue([jest.fn().mockResolvedValue(null), { loading: false }]);
  });

  it("renders a email input", () => {
    render(<LoginForm />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("renders a password input", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });

  it("calls the onSubmit callback if the form is sent successfully", async () => {
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const onSubmit = jest.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(onSubmit).toHaveBeenCalled();
  });

  it("does not call onSubmit if the form does not filled out", async () => {
    const onSubmit = jest.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("The password is required");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls the login mutation on submit", async () => {
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const login = jest.fn();
    (useLoginMutation as jest.Mock).mockReturnValue([login, { loading: false }]);

    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(login).toHaveBeenCalledWith({ variables: { email, password } });
  });

  it("renders a invalid password message if the graphql mutation fails", async () => {
    (useLoginMutation as jest.Mock).mockImplementation((options: Parameters<typeof useLoginMutation>[0]) => {
      const login = (): void => {
        options.onError({ graphQLErrors: [{ extensions: { code: "BAD_USER_INPUT" } }] } as unknown as ApolloError);
      };
      return [login, { loading: false }];
    });
    render(<LoginForm />);

    const email = "test@a11yphant.com";
    const password = "verysecret";

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(await screen.findByText("The email or the password is incorrect.")).toBeInTheDocument();
  });
});
