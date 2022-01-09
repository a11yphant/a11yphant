import { ApolloError } from "@apollo/client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUpForm from "app/components/user/SignUpForm";
import { useRegisterMutation } from "app/generated/graphql";
import React from "react";

jest.mock("app/generated/graphql", () => ({
  useRegisterMutation: jest.fn(),
}));

describe("sign up form", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useRegisterMutation as jest.Mock).mockReturnValue([jest.fn().mockResolvedValue({ errors: null }), { loading: false }]);
  });

  it("renders a name input", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("textbox", { name: /Name/ })).toBeInTheDocument();
  });

  it("renders a email input", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInTheDocument();
  });

  it("renders a password input", () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("button", { name: /Sign up/ })).toBeInTheDocument();
  });

  it("calls the onAfterSubmit callback if the form is sent successfully", async () => {
    const name = "name";
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const onAfterSubmit = jest.fn();

    render(<SignUpForm onAfterSubmit={onAfterSubmit} />);

    const nameInput = screen.getByRole("textbox", { name: /Name/ });
    fireEvent.change(nameInput, { target: { value: name } });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(nameInput).toHaveValue(name));
    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(onAfterSubmit).toHaveBeenCalled();
  });

  it("does not call onAfterSubmit if the form does not filled out", async () => {
    const onAfterSubmit = jest.fn();

    render(<SignUpForm onAfterSubmit={onAfterSubmit} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await screen.findByText("The email address is required");

    expect(onAfterSubmit).not.toHaveBeenCalled();
  });

  it("calls the register mutation on submit", async () => {
    const name = "name";
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const register = jest.fn().mockReturnValue({ errors: null });
    (useRegisterMutation as jest.Mock).mockReturnValue([register, { loading: false }]);

    render(<SignUpForm />);

    const nameInput = screen.getByRole("textbox", { name: /Name/ });
    fireEvent.change(nameInput, { target: { value: name } });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(nameInput).toHaveValue(name));
    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(register).toHaveBeenCalledWith({ variables: { name, email, password } });
  });

  it("renders a email already taken message if the graphql mutation fails with a INPUT_ERROR", async () => {
    (useRegisterMutation as jest.Mock).mockImplementation((options: Parameters<typeof useRegisterMutation>[0]) => {
      const login = (): { errors: {}[] } => {
        options.onError({ graphQLErrors: [{ extensions: { code: "INPUT_ERROR" } }] } as unknown as ApolloError);
        return { errors: [] };
      };
      return [login, { loading: false }];
    });
    render(<SignUpForm />);

    const name = "name";
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const nameInput = screen.getByRole("textbox", { name: /Name/ });
    fireEvent.change(nameInput, { target: { value: name } });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(nameInput).toHaveValue(name));
    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(await screen.findByText("This email is already taken")).toBeInTheDocument();
  });

  it("renders a unknown error message if the graphql mutation fails", async () => {
    (useRegisterMutation as jest.Mock).mockImplementation((options: Parameters<typeof useRegisterMutation>[0]) => {
      const login = (): { errors: {}[] } => {
        options.onError({ graphQLErrors: [] } as unknown as ApolloError);
        return { errors: [] };
      };
      return [login, { loading: false }];
    });
    render(<SignUpForm />);

    const name = "name";
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const nameInput = screen.getByRole("textbox", { name: /Name/ });
    fireEvent.change(nameInput, { target: { value: name } });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(nameInput).toHaveValue(name));
    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    expect(await screen.findByText("An unknown error occurred")).toBeInTheDocument();
  });

  it("does not call onAfterSubmit if the graphql mutation fails", async () => {
    const onAfterSubmit = jest.fn();

    (useRegisterMutation as jest.Mock).mockImplementation((options: Parameters<typeof useRegisterMutation>[0]) => {
      const login = (): { errors?: {}[] } => {
        options.onError({ graphQLErrors: [] } as unknown as ApolloError);
        return { errors: [] };
      };
      return [login, { loading: false }];
    });

    render(<SignUpForm onAfterSubmit={onAfterSubmit} />);

    const name = "name";
    const email = "test@a11yphant.com";
    const password = "verysecret";

    const nameInput = screen.getByRole("textbox", { name: /Name/ });
    fireEvent.change(nameInput, { target: { value: name } });

    const emailInput = screen.getByRole("textbox", { name: /Email/ });
    fireEvent.change(emailInput, { target: { value: email } });

    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: password } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => expect(nameInput).toHaveValue(name));
    await waitFor(() => expect(emailInput).toHaveValue(email));
    await waitFor(() => expect(passwordInput).toHaveValue(password));

    await screen.findByText("An unknown error occurred");

    expect(onAfterSubmit).not.toHaveBeenCalled();
  });
});
