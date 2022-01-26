import { render, screen } from "@testing-library/react";
import { ValidatePasswordResetTokenResultEnum } from "app/generated/graphql";
import { initializeApollo } from "app/lib/apollo-client";
import ResetPassword, { getServerSideProps, ResetPasswordProps } from "app/pages/reset-password";
import { GetServerSidePropsContext } from "next";

const validationResult = ValidatePasswordResetTokenResultEnum.Valid;

jest.mock("app/components/Navigation", () => {
  return {
    __esModule: true,
    default: () => <></>,
  };
});

jest.mock("app/components/passwordReset/PasswordResetForm", () => {
  return {
    __esModule: true,
    default: () => <>Password Reset Form</>,
  };
});

jest.mock("app/lib/apollo-client", () => ({
  initializeApollo: jest.fn(),
}));

describe("reset password page", () => {
  describe("page", () => {
    it("renders an error message when token is invalid", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.InvalidToken} />);

      expect(screen.getByText("Invalid token")).toBeInTheDocument();
    });

    it("renders an error message when the token is expired", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.Expired} />);

      expect(screen.getByText("Expired token")).toBeInTheDocument();
    });

    it("renders an error message when the user is unknown", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.UnknownUser} />);

      expect(screen.getByText("Unknown user")).toBeInTheDocument();
    });

    it("renders the password reset form when the token is valid", async () => {
      render(<ResetPassword token="token" tokenValidationResult={ValidatePasswordResetTokenResultEnum.Valid} />);

      expect(screen.getByText("Password Reset Form")).toBeInTheDocument();
    });
  });
  describe("get server side props", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (initializeApollo as jest.Mock).mockReturnValue({
        mutate: jest.fn().mockResolvedValue({ data: { validatePasswordResetToken: { result: validationResult } } }),
      });
    });

    it("returns the token", async () => {
      const { props } = (await getServerSideProps({
        query: { token: "token" },
      } as unknown as GetServerSidePropsContext)) as { props: ResetPasswordProps };

      expect(props.token).toBe("token");
    });

    it("returns the token validation result", async () => {
      const { props } = (await getServerSideProps({
        query: { token: "token" },
      } as unknown as GetServerSidePropsContext)) as { props: ResetPasswordProps };

      expect(props.tokenValidationResult).toBe(validationResult);
    });
  });
});
