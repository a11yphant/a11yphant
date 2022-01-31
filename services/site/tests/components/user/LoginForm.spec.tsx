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
    (useLoginMutation as jest.Mock).mockReturnValue([jest.fn().mockResolvedValue({ errors: null }), { loading: false }]);
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

  it("calls the onAfterSubmit callback if the form is sent successfully", async () => {
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const onAfterSubmit = jest.fn();

    render(<LoginForm onAfterSubmit={onAfterSubmit} />);

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(onAfterSubmit).toHaveBeenCalled();
  });

  it("does not call onSubmit if the form does not filled out", async () => {
    const onSubmit = jest.fn();

    render(<LoginForm onAfterSubmit={onSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("The password is required");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls the login mutation on submit", async () => {
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const login = jest.fn().mockReturnValue({ errors: null });
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

  it("renders a invalid password message if the graphql mutation fails with an input error", async () => {
    (useLoginMutation as jest.Mock).mockImplementation((options: Parameters<typeof useLoginMutation>[0]) => {
      const login = (): { errors: {}[] } => {
        options.onError({ graphQLErrors: [{ extensions: { code: "BAD_USER_INPUT" } }] } as unknown as ApolloError);
        return { errors: [null] };
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

  it("renders a unknown error message if the graphql mutation fails with an unknown error type", async () => {
    (useLoginMutation as jest.Mock).mockImplementation((options: Parameters<typeof useLoginMutation>[0]) => {
      const login = (): { errors: {}[] } => {
        options.onError({ graphQLErrors: [] } as unknown as ApolloError);
        return { errors: [null] };
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

    expect(await screen.findByText("An unknown error occurred")).toBeInTheDocument();
  });

  it("does not call onAfterSubmit if the mutation fails", async () => {
    const onAfterSubmit = jest.fn();

    (useLoginMutation as jest.Mock).mockImplementation((options: Parameters<typeof useLoginMutation>[0]) => {
      const login = (): { errors: {}[] } => {
        options.onError({ graphQLErrors: [] } as unknown as ApolloError);

        return { errors: [null] };
      };
      return [login, { loading: false }];
    });

    render(<LoginForm onAfterSubmit={onAfterSubmit} />);

    const email = "test@a11yphant.com";
    const password = "verysecret";

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("An unknown error occurred");

    expect(onAfterSubmit).not.toHaveBeenCalled();
  });
});
